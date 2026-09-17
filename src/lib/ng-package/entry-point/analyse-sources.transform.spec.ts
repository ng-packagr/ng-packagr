import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { lastValueFrom, of } from 'rxjs';
import ts from 'typescript';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FileCache } from '../../file-system/file-cache';
import { BuildGraph } from '../../graph/build-graph';
import { EntryPointNode, PackageNode } from '../nodes';
import { analyseSourcesTransform } from './analyse-sources.transform';

describe('analyseSourcesTransform', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'ng-packagr-analyse-sources-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  async function analyse(files: Record<string, string>): Promise<void> {
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

    await lastValueFrom(of(graph).pipe(analyseSourcesTransform));
  }

  it('should allow an index.ts parallel to the entry file when it is not imported', async () => {
    await expect(
      analyse({
        'public-api.ts': `export const foo = 1;`,
        'index.ts': `export * from './public-api';`,
      }),
    ).resolves.toBeUndefined();
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
