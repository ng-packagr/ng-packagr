import * as path from 'path';
import { Observable, concat as concatStatic, of as observableOf, pipe, NEVER, from } from 'rxjs';
import {
  concatMap,
  map,
  switchMap,
  tap,
  mapTo,
  catchError,
  startWith,
  debounceTime,
  filter,
  last
} from 'rxjs/operators';
import { BuildGraph } from '../brocc/build-graph';
import { DepthBuilder } from '../brocc/depth';
import { STATE_IN_PROGESS } from '../brocc/node';
import { Transform } from '../brocc/transform';
import * as log from '../util/log';
import { rimraf } from '../util/rimraf';
import { PackageNode, EntryPointNode, ngUrl, isEntryPoint, byEntryPoint, isPackage } from './nodes';
import { discoverPackages } from './discover-packages';
import { createFileWatch } from '../file/file-watcher';
import { NgPackagrOptions } from './options.di';
import { unique, flatten } from '../util/array';
import { copyFile } from '../util/copy';

/**
 * A transformation for building an npm package:
 *
 *  - discoverPackages
 *  - options
 *  - initTsConfig
 *  - analyzeTsSources (thereby extracting template and stylesheet files)
 *  - for each entry point
 *    - run the entryPontTransform
 *  - writeNpmPackage
 *
 * @param project Project token, reference to `ng-package.json`
 * @param options ng-packagr options
 * @param initTsConfigTransform Transformation initializing the tsconfig of each entry point.
 * @param analyseSourcesTransform Transformation analyzing the typescript source files of each entry point.
 * @param entryPointTransform Transformation for asset rendering and compilation of a single entry point.
 */
export const packageTransformFactory = (
  project: string,
  options: NgPackagrOptions,
  initTsConfigTransform: Transform,
  analyseSourcesTransform: Transform,
  entryPointTransform: Transform
) => (source$: Observable<BuildGraph>): Observable<BuildGraph> => {
  const pkgUri = ngUrl(project);

  const buildTransform = options.watch
    ? watchTransformFactory(project, options, analyseSourcesTransform, entryPointTransform)
    : buildTransformFactory(project, analyseSourcesTransform, entryPointTransform);

  return source$.pipe(
    tap(() => log.info(`Building Angular Package`)),
    // Discover packages and entry points
    switchMap(graph => {
      const pkg = discoverPackages({ project });

      return from(pkg).pipe(
        map(value => {
          const ngPkg = new PackageNode(pkgUri);
          ngPkg.data = value;

          return graph.put(ngPkg);
        })
      );
    }),
    // Clean the primary dest folder (should clean all secondary sub-directory, as well)
    switchMap(graph => {
      const { dest, deleteDestPath } = graph.get(pkgUri).data;
      return from(deleteDestPath ? rimraf(dest) : Promise.resolve());
    }, (graph, _) => graph),
    // Add entry points to graph
    map(graph => {
      const ngPkg = graph.get(pkgUri);
      const entryPoints = [ngPkg.data.primary, ...ngPkg.data.secondaries].map(entryPoint => {
        const { destinationFiles, moduleId } = entryPoint;
        const node = new EntryPointNode(ngUrl(moduleId));
        node.data = { entryPoint, destinationFiles };
        node.state = 'dirty';
        ngPkg.dependsOn(node);

        return node;
      });

      return graph.put(entryPoints);
    }),
    // Initialize the tsconfig for each entry point
    initTsConfigTransform,
    // perform build
    buildTransform
  );
};

const watchTransformFactory = (
  project: string,
  options: NgPackagrOptions,
  analyseSourcesTransform: Transform,
  entryPointTransform: Transform
) => (source$: Observable<BuildGraph>): Observable<BuildGraph> => {
  const CompleteWaitingForFileChange = '\nCompilation complete. Watching for file changes...';
  const FileChangeDetected = '\nFile change detected. Starting incremental compilation...';
  const FailedWaitingForFileChange = '\nCompilation failed. Watching for file changes...';

  return source$.pipe(
    switchMap(graph => {
      const { data } = graph.find(isPackage) as PackageNode;
      return createFileWatch(data.src, [data.dest]).pipe(
        tap(fileChange => {
          const entryPoints = graph.filter(isEntryPoint);
          const { filePath } = fileChange;
          let filePathsToClean: string[] = [filePath];

          entryPoints.forEach((node: EntryPointNode) => {
            const { sourcesFileCache } = node.cache;
            const cached = sourcesFileCache.get(filePath);

            // when a ts file changes we also need to clean it's .d.ts file
            // and the entrypoint metadata due to the fact that metadata is used to validate component properties
            if (cached && cached.declarationFileName) {
              const { metadata } = node.data.destinationFiles;
              filePathsToClean.push(cached.declarationFileName, metadata);
            }
          });

          filePathsToClean = unique(filePathsToClean);

          entryPoints.forEach((node: EntryPointNode) => {
            const { sourcesFileCache } = node.cache;

            let isDirty = false;

            filePathsToClean.forEach(x => {
              isDirty = sourcesFileCache.delete(x) || isDirty;
            });

            if (isDirty) {
              node.state = 'dirty';
            }
          });
        }),
        debounceTime(200),
        tap(() => log.msg(FileChangeDetected)),
        startWith(undefined),
        mapTo(graph)
      );
    }),
    switchMap(graph => {
      return observableOf(graph).pipe(
        buildTransformFactory(project, analyseSourcesTransform, entryPointTransform),
        tap(() => log.msg(CompleteWaitingForFileChange)),
        catchError(error => {
          log.error(error);
          log.msg(FailedWaitingForFileChange);
          return NEVER;
        })
      );
    })
  );
};

const buildTransformFactory = (project: string, analyseSourcesTransform: Transform, entryPointTransform: Transform) => (
  source$: Observable<BuildGraph>
): Observable<BuildGraph> => {
  const pkgUri = ngUrl(project);
  return source$.pipe(
    // Analyse dependencies and external resources for each entry point
    analyseSourcesTransform,
    // Next, run through the entry point transformation (assets rendering, code compilation)
    scheduleEntryPoints(entryPointTransform),
    // Write npm package to dest folder
    writeNpmPackage(pkgUri),
    tap(graph => {
      const ngPkg = graph.get(pkgUri);
      log.success(`Built Angular Package!
 - from: ${ngPkg.data.src}
 - to:   ${ngPkg.data.dest}`);
    })
  );
};

const writeNpmPackage = (pkgUri: string): Transform =>
  pipe(
    switchMap(graph => {
      const { data } = graph.get(pkgUri);
      const filesToCopy = Promise.all(
        [`${data.src}/LICENSE`, `${data.src}/README.md`].map(src =>
          copyFile(src, path.join(data.dest, path.basename(src)))
        )
      );

      return from(filesToCopy).pipe(map(() => graph));
    })
  );

const scheduleEntryPoints = (epTransform: Transform): Transform =>
  pipe(
    concatMap(graph => {
      // Calculate node/dependency depth and determine build order
      const depthBuilder = new DepthBuilder();
      const entryPoints = graph.filter(isEntryPoint);
      entryPoints.forEach(entryPoint => {
        const deps = entryPoint.filter(isEntryPoint).map(ep => ep.url);
        depthBuilder.add(entryPoint.url, deps);
      });

      // The array index is the depth.
      const groups = depthBuilder.build();

      // Build entry points with lower depth values first.
      return from(flatten(groups)).pipe(
        map(epUrl => graph.find(byEntryPoint().and(ep => ep.url === epUrl)) as EntryPointNode),
        filter(entryPoint => entryPoint.state !== 'done'),
        concatMap(ep =>
          observableOf(ep).pipe(
            // Mark the entry point as 'in-progress'
            tap(entryPoint => (entryPoint.state = STATE_IN_PROGESS)),
            mapTo(graph),
            epTransform
          )
        ),
        last()
      );
    })
  );
