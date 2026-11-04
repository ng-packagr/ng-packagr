import { Subject, Subscription, of, tap } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type FileChangedEvent, createFileWatch } from '../file-system/file-watcher';
import { BuildGraph } from '../graph/build-graph';
import { Node, STATE_IN_PROGRESS } from '../graph/node';
import { transformFromPromise } from '../graph/transform';
import log from '../utils/log';
import { discoverPackages } from './discover-packages';
import { NgEntryPoint } from './entry-point/entry-point';
import { entryPointTransformFactory } from './entry-point/entry-point.transform';
import { fileUrl, findEntryPointInProgress, findPackageNode } from './nodes';
import { NgPackage } from './package';
import { packageTransformFactory } from './package.transform';

vi.mock('../file-system/file-watcher', async importOriginal => ({
  ...(await importOriginal<typeof import('../file-system/file-watcher')>()),
  createFileWatch: vi.fn(),
}));
vi.mock('./discover-packages', () => ({ discoverPackages: vi.fn() }));
vi.mock('../styles/stylesheets/sass-language', () => ({ shutdownSassWorkerPool: vi.fn() }));

describe('packageTransformFactory watch mode', () => {
  const files = ['/src/first.ts', '/dependency/dist/package.json'];
  let changes: Subject<FileChangedEvent>;
  let subscription: Subscription;
  let graph: BuildGraph;
  let builds: { resolve: () => void; reject: (error: Error) => void }[];
  let results: ReturnType<typeof vi.fn<(graph: BuildGraph) => void>>;
  let cacheAtBuild: boolean[][];

  beforeEach(async () => {
    vi.useFakeTimers();
    for (const method of ['error', 'info', 'msg', 'success'] as const) {
      vi.spyOn(log, method).mockImplementation(() => {});
    }
    changes = new Subject();
    builds = [];
    results = vi.fn();
    cacheAtBuild = [];
    graph = new BuildGraph();
    vi.mocked(createFileWatch).mockReturnValue({
      onFileChange: changes,
      watcher: { add: vi.fn() } as unknown as ReturnType<typeof createFileWatch>['watcher'],
    });
    vi.mocked(discoverPackages).mockResolvedValue(
      new NgPackage('/src', new NgEntryPoint({ name: 'example' }, { dest: 'dist', deleteDestPath: false }, '/src')),
    );

    const compile = transformFromPromise(async graph => {
      const cache = findPackageNode(graph).cache.sourcesFileCache;
      cacheAtBuild.push(files.map(file => cache.has(file)));
      await new Promise<void>((resolve, reject) => builds.push({ resolve, reject }));
    });
    const entryPointTransform = entryPointTransformFactory(
      compile,
      source => source,
      source => source,
    );
    const init = tap<BuildGraph>(graph => {
      const entryPoint = graph.get('ng://example');
      for (const file of files) {
        const node = new Node(fileUrl(file));
        graph.put(node);
        entryPoint.dependsOn(node);
        findPackageNode(graph).cache.sourcesFileCache.getOrCreate(file).content = 'cached';
      }
    });
    subscription = of(graph)
      .pipe(
        packageTransformFactory('/src/ng-package.json', { watch: true }, init, source => source, entryPointTransform),
      )
      .subscribe(results);
    await vi.advanceTimersByTimeAsync(0);
    expect(builds).toHaveLength(1);
  });

  afterEach(() => {
    subscription.unsubscribe();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function change(filePath = files[0]): void {
    changes.next({ filePath, event: 'change' });
  }

  async function finishBuild(index: number): Promise<void> {
    builds[index].resolve();
    await vi.advanceTimersByTimeAsync(0);
  }

  it('should finish the running build when a file changes before the debounce elapses', async () => {
    change();
    await finishBuild(0);
    expect(results).toHaveBeenCalledTimes(1);
    expect(log.error).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(100);
    expect(builds).toHaveLength(2);
    await finishBuild(1);
    expect(results).toHaveBeenCalledTimes(2);
  });

  it('should leave the running entry point and its cache intact until the build completes', async () => {
    const entryPoint = findEntryPointInProgress(graph);
    change();
    expect(entryPoint.state).toBe(STATE_IN_PROGRESS);
    expect(findPackageNode(graph).cache.sourcesFileCache.has(files[0])).toBe(true);

    await vi.advanceTimersByTimeAsync(100);
    expect(builds).toHaveLength(1);
    expect(entryPoint.state).toBe(STATE_IN_PROGRESS);

    await finishBuild(0);
    expect(results).toHaveBeenCalledTimes(1);
    expect(builds).toHaveLength(2);
    await finishBuild(1);
    expect(results).toHaveBeenCalledTimes(2);
    expect(log.error).not.toHaveBeenCalled();
  });

  it('should collect changes across debounce intervals without losing files or starting redundant builds', async () => {
    change();
    await vi.advanceTimersByTimeAsync(100);
    change(files[1]);
    change();
    await vi.advanceTimersByTimeAsync(100);
    expect(builds).toHaveLength(1);

    await finishBuild(0);
    expect(cacheAtBuild).toEqual([
      [true, true],
      [false, false],
    ]);
    await finishBuild(1);
    expect(builds).toHaveLength(2);
    expect(results).toHaveBeenCalledTimes(2);
    expect(log.error).not.toHaveBeenCalled();
  });

  it('should retain changes received during an incremental build', async () => {
    await finishBuild(0);
    change();
    await vi.advanceTimersByTimeAsync(100);
    expect(builds).toHaveLength(2);

    change(files[1]);
    await vi.advanceTimersByTimeAsync(100);
    expect(builds).toHaveLength(2);
    await finishBuild(1);
    expect(builds).toHaveLength(3);
    await finishBuild(2);
    expect(results).toHaveBeenCalledTimes(3);
    expect(log.error).not.toHaveBeenCalled();
  });

  it('should leave newer changes pending until their debounce window expires', async () => {
    change();
    await vi.advanceTimersByTimeAsync(140);
    change(files[1]);
    await finishBuild(0);
    expect(cacheAtBuild[1]).toEqual([false, true]);

    await finishBuild(1);
    await vi.advanceTimersByTimeAsync(99);
    expect(builds).toHaveLength(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(cacheAtBuild[2]).toEqual([false, false]);
    await finishBuild(2);
    expect(results).toHaveBeenCalledTimes(3);
    expect(log.error).not.toHaveBeenCalled();
  });

  it('should process queued changes after a compilation error', async () => {
    change();
    await vi.advanceTimersByTimeAsync(100);
    const error = new Error('Compilation failed');
    builds[0].reject(error);
    await vi.advanceTimersByTimeAsync(0);
    expect(log.error).toHaveBeenCalledWith(error);
    expect(builds).toHaveLength(2);

    await finishBuild(1);
    expect(results).toHaveBeenCalledTimes(1);
  });

  it('should skip changes that do not affect an entry point', async () => {
    await finishBuild(0);
    change('/unrelated.ts');
    await vi.advanceTimersByTimeAsync(100);
    expect(builds).toHaveLength(1);
    expect(results).toHaveBeenCalledTimes(1);
  });

  it('should recover when a change arrives after a failed build has settled', async () => {
    builds[0].reject(new Error('Compilation failed'));
    await vi.advanceTimersByTimeAsync(0);
    change();
    await vi.advanceTimersByTimeAsync(100);
    expect(builds).toHaveLength(2);
    await finishBuild(1);
    expect(results).toHaveBeenCalledTimes(1);
  });

  it('should not start queued rebuilds after unsubscribing', async () => {
    change();
    await vi.advanceTimersByTimeAsync(100);
    subscription.unsubscribe();
    await finishBuild(0);
    expect(builds).toHaveLength(1);
    expect(results).not.toHaveBeenCalled();
  });
});
