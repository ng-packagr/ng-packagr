import { DepGraph } from 'dependency-graph';
import { availableParallelism } from 'node:os';
import {
  EMPTY,
  NEVER,
  Observable,
  Subscription,
  catchError,
  concatMap,
  debounceTime,
  filter,
  finalize,
  last,
  map,
  of as observableOf,
  of,
  pipe,
  repeat,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { createFileWatch, invalidateEntryPointsAndCacheOnFileChange } from '../file-system/file-watcher';
import { BuildGraph, ScopedBuildGraph } from '../graph/build-graph';
import { Node, STATE_DONE, STATE_ERROR, STATE_IN_PROGRESS, STATE_PENDING } from '../graph/node';
import { Transform } from '../graph/transform';
import { shutdownSassWorkerPool } from '../styles/stylesheets/sass-language';
import { colors } from '../utils/color';
import { rmdir } from '../utils/fs';
import * as log from '../utils/log';
import { discoverPackages } from './discover-packages';
import { EntryPointNode, PackageNode, findPackageNode, isEntryPoint, isEntryPointPending, ngUrl } from './nodes';
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
      : buildTransformFactory(project, options, analyseSourcesTransform, entryPointTransform);

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
            ngPkg.cache.moduleResolutionCache,
          );
          node.data = { entryPoint, destinationFiles };
          node.state = STATE_PENDING;
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
            node.cache?.stylesheetProcessor?.destroy();
          }
        }
        shutdownSassWorkerPool();
      }),
    );
  };

const watchTransformFactory =
  (project: string, options: NgPackagrOptions, analyseSourcesTransform: Transform, entryPointTransform: Transform) =>
  (source$: Observable<BuildGraph>): Observable<BuildGraph> => {
    const CompleteWaitingForFileChange = '\nCompilation complete. Watching for file changes...';
    const FileChangeDetected = '\nFile change detected. Starting incremental compilation...';
    const FailedWaitingForFileChange = '\nCompilation failed. Watching for file changes...';

    return source$.pipe(
      switchMap(graph => {
        const {
          data,
          cache: { sourcesFileCache },
        } = findPackageNode(graph);
        const { onFileChange, watcher } = createFileWatch([], [data.dest + '/'], options.poll);
        graph.watcher = watcher;

        return onFileChange.pipe(
          map(fileChange => invalidateEntryPointsAndCacheOnFileChange(graph, [fileChange.filePath], sourcesFileCache)),
          filter(isChanged => isChanged),
          debounceTime(100),
          tap(() => log.msg(FileChangeDetected)),
          startWith(undefined),
          map(() => graph),
        );
      }),
      switchMap(graph => {
        const startTime = Date.now();
        const pkgUri = ngUrl(project);
        const ngPkg = graph.get(pkgUri);

        return observableOf(graph).pipe(
          analyseSourcesTransform,
          // Next, run through the entry point transformation (assets rendering, code compilation)
          scheduleEntryPoints(entryPointTransform, options),
          repeat({ delay: () => (graph.some(isEntryPointPending()) ? of(1) : EMPTY) }),
          last(),
          tap(() => printBuiltAngularPackage(ngPkg, startTime)),
          catchError(error => {
            log.error(error);
            log.msg(FailedWaitingForFileChange);

            return NEVER;
          }),
          tap(() => log.msg(CompleteWaitingForFileChange)),
        );
      }),
    );
  };

const buildTransformFactory =
  (project: string, options: NgPackagrOptions, analyseSourcesTransform: Transform, entryPointTransform: Transform) =>
  (source$: Observable<BuildGraph>): Observable<BuildGraph> => {
    return source$.pipe(
      switchMap(graph => {
        const startTime = Date.now();
        const pkgUri = ngUrl(project);
        const ngPkg = graph.get(pkgUri);

        return observableOf(graph).pipe(
          // Analyse dependencies and external resources for each entry point
          analyseSourcesTransform,
          // Next, run through the entry point transformation (assets rendering, code compilation)
          scheduleEntryPoints(entryPointTransform, options),
          tap(() => printBuiltAngularPackage(ngPkg, startTime)),
        );
      }),
    );
  };

const scheduleEntryPoints = (epTransform: Transform, options: NgPackagrOptions): Transform =>
  pipe(
    concatMap(
      graph =>
        new Observable<BuildGraph>(subscriber => {
          // Calculate node/dependency depth and determine build order
          const depGraph = new DepGraph({ circular: false });
          const entryPoints = new Map<string, EntryPointNode>();

          for (const node of graph.values()) {
            if (!isEntryPoint(node)) {
              continue;
            }

            // Remove `ng://` prefix for better error messages
            const from = node.url.startsWith('ng://') ? node.url.slice(5) : node.url;
            entryPoints.set(from, node);
            depGraph.addNode(from);

            for (const dep of node.dependents) {
              if (!isEntryPoint(dep)) {
                continue;
              }

              const to = dep.url.startsWith('ng://') ? dep.url.slice(5) : dep.url;
              depGraph.addNode(to);
              depGraph.addDependency(from, to);
            }
          }

          // Topological sort will throw a DependencyCycleError if cycles exist
          const overallOrder = depGraph.overallOrder();
          const pending = new Set<string>();

          for (const id of overallOrder) {
            const ep = entryPoints.get(id);
            if (ep && ep.state !== STATE_DONE) {
              pending.add(id);
            }
          }

          if (pending.size === 0) {
            subscriber.next(graph);
            subscriber.complete();

            return;
          }

          const inDegree = new Map<string, number>();
          const readyQueue: string[] = [];

          for (const id of pending) {
            const directDeps = depGraph.directDependenciesOf(id);
            let pendingDepsCount = 0;
            for (const dep of directDeps) {
              if (pending.has(dep)) {
                pendingDepsCount++;
              }
            }
            inDegree.set(id, pendingDepsCount);
            if (pendingDepsCount === 0) {
              readyQueue.push(id);
            }
          }

          const maxConcurrency = Math.max(1, Math.min(availableParallelism() - 1, 8));
          let activeCount = 0;
          let buildError: unknown = null;
          let isCancelled = false;
          const activeSubscriptions = new Set<Subscription>();

          const toError = (err: unknown): Error => {
            if (err instanceof Error) {
              return err;
            }
            if (typeof err === 'string') {
              return new Error(err);
            }
            if (
              err &&
              typeof err === 'object' &&
              'message' in err &&
              typeof (err as { message: unknown }).message === 'string'
            ) {
              return new Error((err as { message: string }).message);
            }

            return new Error('Build error');
          };

          const next = () => {
            if (isCancelled) {
              return;
            }

            if (buildError) {
              if (activeCount === 0) {
                subscriber.error(toError(buildError));
              }

              return;
            }

            if (pending.size === 0 && activeCount === 0) {
              subscriber.next(graph);
              subscriber.complete();

              return;
            }

            if (activeCount === 0 && readyQueue.length === 0 && pending.size > 0) {
              const pendingIds = [...pending].join(', ');
              subscriber.error(new Error(`Deadlock detected: unresolved dependencies for [${pendingIds}]`));

              return;
            }

            while (activeCount < maxConcurrency && readyQueue.length > 0) {
              const id = readyQueue.shift();
              if (!id) {
                break;
              }

              const ep = entryPoints.get(id);
              if (!ep) {
                buildError = new Error(`Entry point node not found for '${id}'`);
                readyQueue.length = 0;
                if (activeCount === 0) {
                  subscriber.error(toError(buildError));
                }

                return;
              }

              activeCount++;

              const scopedGraph = new ScopedBuildGraph(graph, ep);
              const run$ = of(scopedGraph).pipe(
                tap(() => {
                  ep.state = STATE_IN_PROGRESS;
                }),
                epTransform,
                catchError(err => {
                  ep.state = STATE_ERROR;
                  throw err;
                }),
                finalize(() => {
                  if (!options.watch) {
                    ep.dispose();
                  }
                }),
              );

              const sub: Subscription = run$.subscribe({
                error: err => {
                  activeSubscriptions.delete(sub);
                  activeCount--;
                  if (!buildError) {
                    buildError = err;
                    readyQueue.length = 0;
                  }
                  next();
                },
                complete: () => {
                  activeSubscriptions.delete(sub);
                  activeCount--;
                  pending.delete(id);

                  for (const depId of depGraph.directDependantsOf(id)) {
                    if (pending.has(depId)) {
                      const remaining = (inDegree.get(depId) ?? 1) - 1;
                      inDegree.set(depId, remaining);
                      if (remaining === 0) {
                        readyQueue.push(depId);
                      }
                    }
                  }

                  next();
                },
              });

              activeSubscriptions.add(sub);
            }
          };

          next();

          return () => {
            isCancelled = true;
            readyQueue.length = 0;
            for (const activeSub of activeSubscriptions) {
              activeSub.unsubscribe();
            }
            activeSubscriptions.clear();
          };
        }),
    ),
  );

function printBuiltAngularPackage(ngPackage: Node, startTime: number): void {
  log.success('\n------------------------------------------------------------------------------');
  log.success(`Built Angular Package
- from: ${ngPackage.data.src}
- to:   ${ngPackage.data.dest}`);
  log.success('------------------------------------------------------------------------------');
  const b = colors.bold;
  const w = colors.white;
  log.msg(w(`\nBuild at: ${b(new Date().toISOString())} - Time: ${b('' + (Date.now() - startTime))}ms\n`));
}
