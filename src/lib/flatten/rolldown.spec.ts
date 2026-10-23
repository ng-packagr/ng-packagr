import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { OutputChunk } from 'rolldown';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { OutputFileCache } from '../ng-package/nodes';
import { ensureUnixPath } from '../utils/path';
import { rolldownBundleFile } from './rolldown';

describe('rolldownBundleFile', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'ng-packagr-rolldown-test-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('should tree-shake unreferenced and unexported declarations in .d.ts bundles', async () => {
    const fileCache: OutputFileCache = new Map([
      [
        ensureUnixPath(join(tempDir, 'src/internal.d.ts')),
        {
          content: 'export interface PublicA { id: string; }\ninterface UnexportedInternalA { secret: number; }',
        },
      ],
      [
        ensureUnixPath(join(tempDir, 'src/tree.d.ts')),
        {
          content: [
            'export interface Leaf { readonly id: string; }',
            'export declare function helper(): Leaf;',
            'export declare function unusedHelper(): string;',
            'export declare const UNUSED_KEY = "unused";',
          ].join('\n'),
        },
      ],
      [
        ensureUnixPath(join(tempDir, 'src/service.d.ts')),
        {
          content: 'import { type Leaf } from "./tree";\nexport declare class Service { leaf(): Leaf; }',
        },
      ],
      [
        ensureUnixPath(join(tempDir, 'src/public-api.d.ts')),
        {
          content: 'export * from "./internal";\nexport { Service } from "./service";\nexport declare const a = 1;',
        },
      ],
    ]);

    const { files } = await rolldownBundleFile({
      entry: join(tempDir, 'src/public-api.d.ts'),
      entryName: 'my-lib',
      moduleName: 'my-lib',
      dir: join(tempDir, 'dist'),
      fileCache,
      sourcemap: false,
    });

    const dtsChunk = files.find((f): f is OutputChunk => f.type === 'chunk' && f.fileName === 'my-lib.d.ts');
    expect(dtsChunk).toBeDefined();
    expect(dtsChunk?.code).toContain('PublicA');
    expect(dtsChunk?.code).toContain('Service');
    expect(dtsChunk?.code).toContain('Leaf');
    expect(dtsChunk?.code).not.toContain('UnexportedInternalA');
    expect(dtsChunk?.code).not.toContain('helper');
    expect(dtsChunk?.code).not.toContain('unusedHelper');
    expect(dtsChunk?.code).not.toContain('UNUSED_KEY');
  });

  it('should preserve declare global and module augmentations in side-effect .d.ts imports', async () => {
    const fileCache: OutputFileCache = new Map([
      [
        ensureUnixPath(join(tempDir, 'src/globals.d.ts')),
        {
          content: 'export {};\ndeclare global {\n  interface Window {\n    myCustomGlobal: boolean;\n  }\n}\n',
        },
      ],
      [
        ensureUnixPath(join(tempDir, 'src/augment.d.ts')),
        {
          content:
            "declare module '@angular/core' {\n  interface Component {\n    augmentedProp?: string;\n  }\n}\nexport {};\n",
        },
      ],
      [
        ensureUnixPath(join(tempDir, 'src/public-api.d.ts')),
        {
          content: 'import "./globals";\nexport * from "./augment";\nexport declare const a = 1;\n',
        },
      ],
    ]);

    const { files } = await rolldownBundleFile({
      entry: join(tempDir, 'src/public-api.d.ts'),
      entryName: 'my-lib',
      moduleName: 'my-lib',
      dir: join(tempDir, 'dist'),
      fileCache,
      sourcemap: false,
    });

    const dtsChunk = files.find((f): f is OutputChunk => f.type === 'chunk' && f.fileName === 'my-lib.d.ts');
    expect(dtsChunk).toBeDefined();
    expect(dtsChunk?.code).toContain('myCustomGlobal');
    expect(dtsChunk?.code).toContain('augmentedProp');
  });

  it('should preserve legal comments in emitted FESM2022 .mjs bundles', async () => {
    const fileCache: OutputFileCache = new Map([
      [
        ensureUnixPath(join(tempDir, 'src/public-api.js')),
        {
          content: '/*! @license MIT Custom Header */\nexport const VALUE = 42;',
        },
      ],
    ]);

    const { files } = await rolldownBundleFile({
      entry: join(tempDir, 'src/public-api.js'),
      entryName: 'my-lib',
      moduleName: 'my-lib',
      dir: join(tempDir, 'dist'),
      fileCache,
      sourcemap: true,
    });

    const mjsChunk = files.find((f): f is OutputChunk => f.type === 'chunk' && f.fileName === 'my-lib.mjs');
    expect(mjsChunk).toBeDefined();
    expect(mjsChunk?.code).toContain('/*! @license MIT Custom Header */');
  });
});
