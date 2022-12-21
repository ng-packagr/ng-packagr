import { DepGraph } from 'dependency-graph';
import { NEVER, Observable, finalize, from, of as observableOf, pipe } from 'rxjs';
import {
  catchError,
  concatMap,
  debounceTime,
  defaultIfEmpty,
  filter,
  map,
  startWith,
  switchMap,
  takeLast,
  tap,
} from 'rxjs/operators';
import { FileCache } from '../file-system/file-cache';
import { createFileWatch } from '../file-system/file-watcher';
import { BuildGraph } from '../graph/build-graph';
import { STATE_IN_PROGRESS } from '../graph/node';
import { Transform } from '../graph/transform';
import { colors } from '../utils/color';
import { rmdir } from '../utils/fs';
import * as log from '../utils/log';
import { ensureUnixPath } from '../utils/path';
import { discoverPackages } from './discover-packages';
import {
  EntryPointNode,
  GlobCache,
  PackageNode,
  byEntryPoint,
  fileUrl,
  fileUrlPath,
  isEntryPoint,
  isPackage,
  ngUrl,
} from './nodes';
import { NgPackagrOptions } from './options.di';

/**
 * A transformation for building an npm package:
 *
 *  - discoverPackages
 *  - options
 *  - initTsConfig
 *  - analyzeTsSources (thereby extracting template and stylesheet files)
 *  - for each entry point
 *    - run the entryPontTransform
 *
 * @param project Project token, reference to `ng-package.json`
 * @param options ng-packagr options
 * @param initTsConfigTransform Transformation initializing the tsconfig of each entry point.
 * @param analyseSourcesTransform Transformation analyzing the typescript source files of each entry point.
 * @param entryPointTransform Transformation for asset rendering and compilation of a single entry point.
 */
export const packageTransformFactory =
  (
    project: string,
    options: NgPackagrOptions,
    initTsConfigTransform: Transform,
    analyseSourcesTransform: Transform,
    entryPointTransform: Transform,
  ) =>
  (source$: Observable<BuildGraph>): Observable<BuildGraph> => {
    log.info(`Building Angular Package`);

    const buildTransform = options.watch
      ? watchTransformFactory(project, options, analyseSourcesTransform, entryPointTransform)
      : buildTransformFactory(project, analyseSourcesTransform, entryPointTransform);

    const pkgUri = ngUrl(project);
    const ngPkg = new PackageNode(pkgUri);

    return source$.pipe(
      // Discover packages and entry points
      // Clean the primary dest folder (should clean all secondary sub-directory, as well)
      switchMap(async graph => {
        ngPkg.data = await discoverPackages({ project });

        graph.put(ngPkg);
        const { dest, deleteDestPath } = ngPkg.data;

        if (deleteDestPath) {
          try {
            await rmdir(dest, { recursive: true });
          } catch {}
        }

        const entryPoints = [ngPkg.data.primary, ...ngPkg.data.secondaries].map(entryPoint => {
          const { destinationFiles, moduleId } = entryPoint;
          const node = new EntryPointNode(
            ngUrl(moduleId),
            ngPkg.cache.sourcesFileCache,
            ngPkg.cache.ngccProcessingCache,
            ngPkg.cache.moduleResolutionCache,
          );
          node.data = { entryPoint, destinationFiles };
          node.state = 'dirty';
          ngPkg.dependsOn(node);

          return node;
        });

        // Add entry points to graph
        return graph.put(entryPoints);
      }),
      // Initialize the tsconfig for each entry point
      initTsConfigTransform,
      // perform build
      buildTransform,
      finalize(() => {
        for (const node of ngPkg.dependents) {
          if (node instanceof EntryPointNode) {
            node.cache.stylesheetProcessor?.destroy();
          }
        }
      }),
    );
  };

const watchTransformFactory =
  (project: string, _options: NgPackagrOptions, analyseSourcesTransform: Transform, entryPointTransform: Transform) =>
  (source$: Observable<BuildGraph>): Observable<BuildGraph> => {
    const CompleteWaitingForFileChange = '\nCompilation complete. Watching for file changes...';
    const FileChangeDetected = '\nFile change detected. Starting incremental compilation...';
    const FailedWaitingForFileChange = '\nCompilation failed. Watching for file changes...';

    return source$.pipe(
      switchMap(graph => {
        const { data, cache } = graph.find(isPackage);
        const { onFileChange, watcher } = createFileWatch([], [data.dest]);
        graph.watcher = watcher;

        return onFileChange.pipe(
          tap(fileChange => {
            const { filePath, event } = fileChange;
            const { sourcesFileCache } = cache;
            const cachedSourceFile = sourcesFileCache.get(filePath);
            const { declarationFileName } = cachedSourceFile || {};
            const uriToClean = [filePath, declarationFileName].map(x => fileUrl(ensureUnixPath(x)));
            const nodesToClean = graph.filter(node => uriToClean.some(uri => uri === node.url));

            if (!cachedSourceFile) {
              if (event === 'unlink' || event === 'add') {
                cache.globCache = regenerateGlobCache(sourcesFileCache);
              }

              if (!nodesToClean) {
                return;
              }
            }

            const allNodesToClean = [
              ...nodesToClean,
              // if a non ts file changes we need to clean up its direct dependees
              // this is mainly done for resources such as html and css
              ...nodesToClean.filter(node => !node.url.endsWith('.ts')).flatMap(node => [...node.dependees]),
            ];

            // delete node that changes
            for (const { url } of allNodesToClean) {
              sourcesFileCache.delete(fileUrlPath(url));
            }

            for (const entryPoint of graph.filter(isEntryPoint)) {
              const isDirty = [...allNodesToClean].some(dependent => entryPoint.dependents.has(dependent));
              if (isDirty) {
                entryPoint.state = 'dirty';

                uriToClean.forEach(url => {
                  entryPoint.cache.analysesSourcesFileCache.delete(fileUrlPath(url));
                });
              }
            }

            // Regenerate glob cache
            if (event === 'unlink' || event === 'add') {
              cache.globCache = regenerateGlobCache(sourcesFileCache);
            }
          }),
          debounceTime(200),
          tap(() => log.msg(FileChangeDetected)),
          startWith(undefined),
          map(() => graph),
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
          }),
        );
      }),
    );
  };

const buildTransformFactory =
  (project: string, analyseSourcesTransform: Transform, entryPointTransform: Transform) =>
  (source$: Observable<BuildGraph>): Observable<BuildGraph> => {
    const startTime = Date.now();

    const pkgUri = ngUrl(project);

    return source$.pipe(
      // Analyse dependencies and external resources for each entry point
      analyseSourcesTransform,
      // Next, run through the entry point transformation (assets rendering, code compilation)
      scheduleEntryPoints(entryPointTransform),
      tap(graph => {
        const ngPkg = graph.get(pkgUri);
        log.success('\n------------------------------------------------------------------------------');
        log.success(`Built Angular Package
 - from: ${ngPkg.data.src}
 - to:   ${ngPkg.data.dest}`);
        log.success('------------------------------------------------------------------------------');
        const b = colors.bold;
        const w = colors.white;
        log.msg(w(`\nBuild at: ${b(new Date().toISOString())} - Time: ${b('' + (Date.now() - startTime))}ms\n`));
      }),
    );
  };

const scheduleEntryPoints = (epTransform: Transform): Transform =>
  pipe(
    concatMap(graph => {
      // Calculate node/dependency depth and determine build order
      const depGraph = new DepGraph({ circular: false });
      const entryPoints: EntryPointNode[] = graph.filter(isEntryPoint);

      for (const entryPoint of entryPoints) {
        // Remove `ng://` prefix for better error messages
        const from = entryPoint.url.substring(5);
        depGraph.addNode(from);

        for (const { url } of entryPoint.filter(isEntryPoint)) {
          const to = url.substring(5);
          depGraph.addNode(to);
          depGraph.addDependency(from, to);
        }
      }

      // The array index is the depth.
      const groups = depGraph.overallOrder().map(ngUrl);

      // Build entry points with lower depth values first.
      return from(groups).pipe(
        map((epUrl: string): EntryPointNode => graph.find(byEntryPoint().and(ep => ep.url === epUrl))),
        filter((entryPoint: EntryPointNode): boolean => entryPoint.state !== 'done'),
        concatMap(ep =>
          observableOf(ep).pipe(
            // Mark the entry point as 'in-progress'
            tap(entryPoint => (entryPoint.state = STATE_IN_PROGRESS)),
            map(() => graph),
            epTransform,
          ),
        ),
        takeLast(1), // don't use last as sometimes it this will cause 'no elements in sequence',
        defaultIfEmpty(graph),
      );
    }),
  );

function regenerateGlobCache(sourcesFileCache: FileCache): GlobCache {
  const cache: GlobCache = {};
  sourcesFileCache.forEach((value, key) => {
    // ignore node_modules and file which don't exists as they are not used by globbing in our case
    if (value.exists && !key.includes('node_modules')) {
      cache[key] = 'FILE';
    }
  });

  return cache;
}
