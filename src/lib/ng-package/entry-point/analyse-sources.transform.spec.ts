import { statSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { lastValueFrom, of } from 'rxjs';
import ts from 'typescript';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FileCache } from '../../file-system/file-cache';
import { BuildGraph } from '../../graph/build-graph';
import { EntryPointNode, PackageNode } from '../nodes';
import { analyseSourcesTransform } from './analyse-sources.transform';

vi.mock('node:fs', async importOriginal => {
  const fs = await importOriginal<typeof import('node:fs')>();

  return { ...fs, statSync: vi.fn(fs.statSync) };
});

describe('analyseSourcesTransform', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'ng-packagr-analyse-sources-'));
    vi.mocked(statSync).mockClear();
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  async function createGraph(
    files: Record<string, string>,
  ): Promise<{ graph: BuildGraph; entryPoint: EntryPointNode }> {
    for (const [name, content] of Object.entries(files)) {
      await writeFile(join(tempDir, name), content);
    }

    const packageNode = new PackageNode('ng://package');
    packageNode.data = { primary: { moduleId: 'example' } } as PackageNode['data'];

    const entryPoint = new EntryPointNode(
      'ng://example',
      new FileCache(),
      ts.createModuleResolutionCache(tempDir, s => s),
    );
    entryPoint.data = {
      entryPoint: { moduleId: 'example', entryFilePath: join(tempDir, 'public-api.ts') },
    } as EntryPointNode['data'];

    const graph = new BuildGraph();
    graph.put([packageNode, entryPoint]);

    return { graph, entryPoint };
  }

  async function run(graph: BuildGraph): Promise<void> {
    await lastValueFrom(of(graph).pipe(analyseSourcesTransform));
  }

  async function analyse(files: Record<string, string>): Promise<void> {
    const { graph } = await createGraph(files);
    await run(graph);
  }

  it('should allow an index.ts parallel to the entry file when it is not imported', async () => {
    await expect(
      analyse({
        'public-api.ts': `export const foo = 1;`,
        'index.ts': `export * from './public-api';`,
      }),
    ).resolves.toBeUndefined();
  });

  it('should stat a missing candidate only once across multiple imports in a pass', async () => {
    const { graph, entryPoint } = await createGraph({
      'public-api.ts': `export * from './first'; export * from './second';`,
      'first.ts': `export * from './missing';`,
      'second.ts': `export * from './missing';`,
    });

    await run(graph);

    const missingPath = join(tempDir, 'missing.ts');
    const attempts = vi.mocked(statSync).mock.calls.filter(([path]) => path === missingPath);
    expect(attempts).toHaveLength(1);
    expect(entryPoint.cache?.analyseSourcesFileCache.get(missingPath)?.exists).toBeUndefined();
  });

  it('should retry missing candidates on the next analysis pass', async () => {
    const { graph, entryPoint } = await createGraph({
      'public-api.ts': `export * from './missing';`,
    });
    const missingPath = join(tempDir, 'missing.ts');

    await run(graph);
    expect(entryPoint.cache?.analyseSourcesFileCache.get(missingPath)?.exists).toBeUndefined();

    await writeFile(missingPath, `export const found = true;`);
    await run(graph);

    expect(entryPoint.cache?.analyseSourcesFileCache.get(missingPath)?.content).toBe(`export const found = true;`);
    expect(vi.mocked(statSync).mock.calls.filter(([path]) => path === missingPath)).toHaveLength(2);
  });

  it('should prefer a newly created .ts file over a previously resolved .tsx candidate', async () => {
    const { graph, entryPoint } = await createGraph({
      'public-api.ts': `export * from './feature.js';`,
      'feature.tsx': `export const previous = true;`,
    });
    const tsPath = join(tempDir, 'feature.ts');

    await run(graph);
    expect(entryPoint.cache?.analyseSourcesFileCache.get(tsPath)?.exists).toBeUndefined();
    expect(entryPoint.cache?.analyseSourcesFileCache.get(join(tempDir, 'feature.tsx'))?.content).toBe(
      `export const previous = true;`,
    );

    await writeFile(tsPath, `export const preferred = true;`);
    await run(graph);

    expect(entryPoint.cache?.analyseSourcesFileCache.get(tsPath)?.content).toBe(`export const preferred = true;`);
  });

  it('should preserve relative references and entry point dependencies', async () => {
    const { graph, entryPoint } = await createGraph({
      'public-api.ts': `/// <reference path="./reference.ts" />\nexport * from './internal';`,
      'reference.ts': `export const referenced = true;`,
      'internal.ts': `export * from 'example/secondary';`,
      'secondary-api.ts': `export const secondary = true;`,
    });
    const secondary = new EntryPointNode(
      'ng://example/secondary',
      new FileCache(),
      ts.createModuleResolutionCache(tempDir, s => s),
    );
    secondary.data = {
      entryPoint: { moduleId: 'example/secondary', entryFilePath: join(tempDir, 'secondary-api.ts') },
    } as EntryPointNode['data'];
    graph.put(secondary);

    await run(graph);

    expect(entryPoint.cache?.analyseSourcesFileCache.get(join(tempDir, 'reference.ts'))?.content).toBe(
      `export const referenced = true;`,
    );
    expect(entryPoint.dependents.has(secondary)).toBe(true);
  });

  it('should propagate unexpected stat errors', async () => {
    const { graph } = await createGraph({ 'public-api.ts': `export * from './missing';` });
    vi.mocked(statSync).mockImplementationOnce(() => {
      throw new Error('Unexpected stat failure');
    });

    await expect(run(graph)).rejects.toThrow('Unexpected stat failure');
  });

  it('should throw when the entry file imports a parallel index.ts', async () => {
    await expect(
      analyse({
        'public-api.ts': `export * from './index';`,
        'index.ts': `export const foo = 1;`,
      }),
    ).rejects.toThrow(`has an 'index.ts' parallel to the 'entryFilePath'`);
  });
});
