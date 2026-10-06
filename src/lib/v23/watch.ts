import { ParsedConfiguration } from '@angular/compiler-cli';
import { Subscription, debounceTime, filter, map } from 'rxjs';
import { createFileWatch, invalidateEntryPointsAndCacheOnFileChange } from '../file-system/file-watcher';
import { analyseSourcesTransform2 } from '../ng-package/entry-point/analyse-sources.transform';
import { compileNgcTransformFactory2 } from '../ng-package/entry-point/compile-ngc.transform';
import { entryPointTransformFactory2 } from '../ng-package/entry-point/entry-point.transform';
import { initTsConfigTransformFactory2 } from '../ng-package/entry-point/init-tsconfig.transform';
import { writeBundlesTransform2 } from '../ng-package/entry-point/write-bundles.transform';
import { writePackageTansform2 } from '../ng-package/entry-point/write-package.transform';
import { isEntryPointPending } from '../ng-package/nodes';
import { NgPackagrOptions, normalizeOptions } from '../ng-package/options';
import { buildTransformFactory2 } from '../ng-package/package.transform';
import { StylesheetProcessor } from '../styles/stylesheet-processor';
import log from '../utils/log';
import { createPackageBuildGraph, disposeEntryPointCaches } from './build';

const CompleteWaitingForFileChange = '\nCompilation complete. Watching for file changes...';
const FileChangeDetected = '\nFile change detected. Starting incremental compilation...';
const FailedWaitingForFileChange = '\nCompilation failed. Watching for file changes...';

export interface NgPackagrWatcher {
  /** Stops watching for file changes and disposes build caches. */
  close(): Promise<void>;
}

/**
 * Promise-based equivalent of the legacy `watchTransformFactory` (`package.transform.ts`),
 * built on top of the same promise-based build pipeline `buildNgPackage` uses
 * (`buildTransformFactory2` and its collaborators).
 *
 * The `BuildGraph` is created once and kept alive for the lifetime of the watcher: a full
 * build runs first, then every subsequent file change invalidates only the affected entry
 * point(s) (`invalidateEntryPointsAndCacheOnFileChange`) before a build pass re-runs. Each
 * build pass re-sorts the whole dependency graph topologically and skips entry points already
 * `STATE_DONE`, so partial rebuilds are still executed in correct dependency order.
 */
export async function watchNgPackage(
  options: NgPackagrOptions,
  project: string,
  tsConfig: ParsedConfiguration | string | undefined,
  onBuildComplete?: () => void,
): Promise<NgPackagrWatcher> {
  log.info(`Building Angular Package`);

  const normalizedOptions = normalizeOptions({ ...options, watch: true });

  const { graph, ngPkg } = await createPackageBuildGraph(project);

  const initTs = initTsConfigTransformFactory2(tsConfig);
  await initTs(graph);

  const buildTransform = buildTransformFactory2(
    project,
    normalizedOptions,
    analyseSourcesTransform2,
    entryPointTransformFactory2(
      compileNgcTransformFactory2(StylesheetProcessor, normalizedOptions),
      writeBundlesTransform2(normalizedOptions),
      writePackageTansform2(normalizedOptions),
    ),
  );

  // Runs build passes until no entry point is left pending - mirrors the legacy
  // `repeat({ delay: () => graph.some(isEntryPointPending()) ? of(1) : EMPTY })`.
  const runBuildPass = async (): Promise<void> => {
    while (graph.some(isEntryPointPending())) {
      await buildTransform(graph);
    }
  };

  // Shared, non-throwing wrapper for every build cycle (the first one included): a
  // build/compile failure is logged and swallowed - the promise-based equivalent of
  // legacy's `catchError(() => NEVER)` - so the watcher is always left alive and able
  // to retry on the next file change. Only genuine setup failures (discovering the
  // package, parsing tsconfig, above) are allowed to reject `watchNgPackage` itself.
  const runBuildCycle = async (): Promise<void> => {
    try {
      await runBuildPass();
      log.msg(CompleteWaitingForFileChange);
      // Matches the legacy observable's per-cycle `next()` (one emission per successful
      // build pass, initial build included) - see `watchTransformFactory` in
      // `package.transform.ts`, which emits once via `startWith(undefined)` for the first
      // pass and again after every subsequent file-change rebuild.
      onBuildComplete?.();
    } catch (err) {
      log.error(err);
      log.msg(FailedWaitingForFileChange);
    }
  };

  const { dest } = ngPkg.data;
  const { sourcesFileCache } = ngPkg.cache;
  const { onFileChange, watcher } = createFileWatch([], [dest + '/'], normalizedOptions.poll);
  // Attach the watcher before the first build runs: `BuildGraph.insert()` auto-registers
  // every newly discovered source-file node with `graph.watcher`, so the watcher must already
  // be in place while the initial build discovers those files, not just for later rebuilds.
  graph.watcher = watcher;

  let closed = false;
  // Serializes rebuilds so a debounced trigger never starts a build pass while the
  // previous one is still running against the same `BuildGraph`.
  let rebuildQueue: Promise<void> = Promise.resolve();

  // Subscribe before the first build attempt: if that first build fails, the watcher
  // must still be listening so a subsequent fix can trigger a retry (matching the
  // legacy pipeline, where the file-change subscription and the build-retry are two
  // independent streams).
  const subscription: Subscription = onFileChange
    .pipe(
      map(fileChange => invalidateEntryPointsAndCacheOnFileChange(graph, [fileChange.filePath], sourcesFileCache)),
      filter(isChanged => isChanged),
      debounceTime(100),
    )
    .subscribe(() => {
      rebuildQueue = rebuildQueue.then(async () => {
        if (closed) {
          return;
        }

        log.msg(FileChangeDetected);
        await runBuildCycle();
      });
    });

  // Initial full build - every entry point starts out `STATE_PENDING`. Routed through
  // the same `rebuildQueue`/`runBuildCycle` as subsequent rebuilds, so a file change
  // arriving while the first build is still running can't start a second, overlapping
  // build pass against the same `BuildGraph`.
  rebuildQueue = rebuildQueue.then(() => runBuildCycle());
  await rebuildQueue;

  return {
    async close(): Promise<void> {
      closed = true;
      subscription.unsubscribe();
      await watcher.close();
      await rebuildQueue;
      disposeEntryPointCaches(ngPkg);
    },
  };
}
