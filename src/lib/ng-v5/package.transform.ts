import * as path from 'path';
import { Observable } from 'rxjs/Observable';
import { concat as concatStatic } from 'rxjs/observable/concat';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of as observableOf } from 'rxjs/observable/of';
import { map, retry, switchMap, takeLast, tap } from 'rxjs/operators';
import { pipe } from 'rxjs/util/pipe';
import { BuildGraph } from '../brocc/build-graph';
import { Node } from '../brocc/node';
import { Transform } from '../brocc/transform';
import * as log from '../util/log';
import { copyFiles } from '../util/copy';
import { rimraf } from '../util/rimraf';
import { PackageNode, EntryPointNode, ngUrl, isEntryPoint } from './nodes';
import { discoverPackages } from './discover-packages';

/**
 * A transformation for building an npm package:
 *
 *  - discoverPackages
 *  - initTsConfig
 *  - analyzeTsSources (thereby extracting template and stylesheet files)
 *  - for each entry point
 *    - run the entryPontTransform
 *  - writeNpmPackage
 *
 * @param project Project token, reference to `ng-package.json`
 * @param initTsConfigTransform Transformation initializing the tsconfig of each entry point.
 * @param analyseSourcesTransform Transformation analyzing the typescript source files of each entry point.
 * @param entryPointTransform Transformation for asset rendering and compilation of a single entry point.
 */
export const packageTransformFactory = (
  project: string,
  initTsConfigTransform: Transform,
  analyseSourcesTransform: Transform,
  entryPointTransform: Transform
) => (source$: Observable<BuildGraph>): Observable<BuildGraph> => {
  const pkgUri = ngUrl(project);

  return source$.pipe(
    tap(() => {
      log.info(`Building Angular Package`);
    }),
    // Discover packages and entry points
    switchMap(graph => {
      const pkg = discoverPackages({ project });

      return fromPromise(pkg).pipe(
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
      return fromPromise(deleteDestPath ? rimraf(dest) : Promise.resolve());
    }, (graph, _) => graph),
    // Add entry points to graph
    map(graph => {
      const ngPkg = graph.get(pkgUri);

      const entryPoints = [ngPkg.data.primary, ...ngPkg.data.secondaries].map(entryPoint => {
        // TODO: use `os-tmpdir` instead -> https://www.npmjs.com/package/os-tmpdir
        // import * as tmpdir from 'os-tempdir'; tmpdir();
        const stageDir = path.resolve(ngPkg.data.workingDirectory, entryPoint.flatModuleFile, 'stage');
        const outDir = path.resolve(ngPkg.data.workingDirectory, entryPoint.flatModuleFile, 'out');

        const node = new EntryPointNode(ngUrl(entryPoint.moduleId));
        node.data = { entryPoint, outDir, stageDir };
        node.state = 'dirty';
        ngPkg.dependsOn(node);

        return node;
      });

      return graph.put(entryPoints);
    }),
    // Initialize the tsconfig for each entry point
    initTsConfigTransform,
    // Analyse dependencies and external resources for each entry point
    analyseSourcesTransform,
    // Next, run through the entry point transformation (assets rendering, code compilation)
    switchMap(graph => {
      const eachEntryPoint$ = graph.filter(isEntryPoint).map(() => observableOf(graph).pipe(entryPointTransform));

      return concatStatic(...eachEntryPoint$).pipe(takeLast(1));
    }),
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
      const ngPkg = graph.get(pkgUri);

      return fromPromise(
        Promise.all([
          copyFiles(`${ngPkg.data.src}/README.md`, ngPkg.data.dest),
          copyFiles(`${ngPkg.data.src}/LICENSE`, ngPkg.data.dest),
          rimraf(ngPkg.data.workingDirectory)
        ])
      ).pipe(map(() => graph));
    })
  );
