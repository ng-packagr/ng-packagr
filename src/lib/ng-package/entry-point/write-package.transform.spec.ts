import { mkdir, mkdtemp, copyFile as nativeCopyFile, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BuildGraph } from '../../graph/build-graph';
import { Node } from '../../graph/node';
import * as fs from '../../utils/fs';
import type { EntryPointNode, PackageNode } from '../nodes';
import { copyAssets } from './write-package.transform';

describe('copyAssets', () => {
  let root: string;
  let graph: BuildGraph;
  let entryPointNode: EntryPointNode;

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'ng-packagr-assets-'));
    graph = new BuildGraph();
    entryPointNode = new Node('ng://test') as EntryPointNode;
    vi.spyOn(fs, 'copyFile').mockImplementation(async (src, dest) => {
      await mkdir(dirname(dest), { recursive: true });
      await nativeCopyFile(src, dest);
    });
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await rm(root, { recursive: true, force: true });
  });

  async function runCopy(assets: { input: string; output: string; glob: string }[]) {
    const packageNode = {
      data: { src: root, dest: join(root, 'dist'), assets },
    } as unknown as PackageNode;
    const entryPoints = [
      { data: { entryPoint: { destinationFiles: { directory: '' } } } },
    ] as unknown as EntryPointNode[];

    await copyAssets(graph, entryPointNode, packageNode, entryPoints);
  }

  async function createFiles(count: number) {
    const paths: string[] = [];
    for (let i = 0; i < count; i++) {
      const path = join('source', 'nested', `file-${i}.txt`);
      await mkdir(dirname(join(root, path)), { recursive: true });
      await writeFile(join(root, path), `content-${i}`);
      paths.push(path);
    }

    return paths;
  }

  it('copies all files, tracks dependencies and limits concurrent copies', async () => {
    const paths = await createFiles(32);
    let active = 0;
    let maximumActive = 0;

    vi.mocked(fs.copyFile).mockImplementation(async (src, dest) => {
      active++;
      maximumActive = Math.max(maximumActive, active);
      try {
        await new Promise(resolve => setTimeout(resolve, 5));
        await mkdir(dirname(dest), { recursive: true });
        await nativeCopyFile(src, dest);
      } finally {
        active--;
      }
    });

    await runCopy([{ glob: '**/*.txt', input: 'source', output: 'assets' }]);

    expect(maximumActive).toBeGreaterThan(1);
    expect(maximumActive).toBeLessThanOrEqual(4);
    expect(active).toBe(0);
    expect(vi.mocked(fs.copyFile)).toHaveBeenCalledTimes(32);
    expect(graph.size).toBe(32);
    expect(entryPointNode.dependents.size).toBe(32);
    for (let i = 0; i < paths.length; i++) {
      expect(await readFile(join(root, 'dist', 'assets', 'nested', `file-${i}.txt`), 'utf8')).toBe(`content-${i}`);
    }
  });

  it('finishes each pattern before the next one overwrites its destination', async () => {
    await mkdir(join(root, 'first'), { recursive: true });
    await mkdir(join(root, 'second'), { recursive: true });
    await writeFile(join(root, 'first', 'shared.txt'), 'first');
    await writeFile(join(root, 'second', 'shared.txt'), 'second');
    let firstFinished = false;

    vi.mocked(fs.copyFile).mockImplementation(async (src, dest) => {
      if (dirname(src) === join(root, 'first')) {
        await new Promise(resolve => setTimeout(resolve, 20));
      } else {
        expect(firstFinished).toBe(true);
      }
      await mkdir(dirname(dest), { recursive: true });
      await nativeCopyFile(src, dest);
      if (dirname(src) === join(root, 'first')) {
        firstFinished = true;
      }
    });

    await runCopy([
      { glob: '*.txt', input: 'first', output: 'shared' },
      { glob: '*.txt', input: 'second', output: 'shared' },
    ]);

    expect(await readFile(join(root, 'dist', 'shared', 'shared.txt'), 'utf8')).toBe('second');
  });

  it('stops scheduling on failure and waits for all active copies', async () => {
    await createFiles(32);
    let started = 0;
    let active = 0;
    let complete = 0;
    let failFirst: () => void;
    let releaseOthers: () => void;
    const firstGate = new Promise<void>(resolve => {
      failFirst = resolve;
    });
    const otherGate = new Promise<void>(resolve => {
      releaseOthers = resolve;
    });

    vi.mocked(fs.copyFile).mockImplementation(async () => {
      const call = ++started;
      active++;
      try {
        if (call === 1) {
          await firstGate;
          throw new Error('copy failed');
        }
        await otherGate;
        complete++;
      } finally {
        active--;
      }
    });

    const task = runCopy([{ glob: '**/*.txt', input: 'source', output: 'assets' }]);
    const rejection = expect(task).rejects.toThrow('copy failed');

    try {
      await vi.waitFor(() => expect(started).toBe(4));
      failFirst();
      await vi.waitFor(() => expect(active).toBe(3));

      let settled = false;
      task.then(
        () => (settled = true),
        () => (settled = true),
      );

      expect(settled).toBe(false);
      releaseOthers();
      await rejection;

      expect(settled).toBe(true);
      expect(started).toBe(4);
      expect(complete).toBe(3);
      expect(active).toBe(0);
    } finally {
      failFirst();
      releaseOthers();
      await task.catch(() => undefined);
    }
  });

  it('recreates output directories on a subsequent copy', async () => {
    await createFiles(1);
    const assets = [{ glob: '**/*.txt', input: 'source', output: 'assets' }];
    await runCopy(assets);
    await rm(join(root, 'dist'), { recursive: true, force: true });
    await runCopy(assets);

    expect(await readFile(join(root, 'dist', 'assets', 'nested', 'file-0.txt'), 'utf8')).toBe('content-0');
  });
});
