import { BuildContext, BuildOptions, build, context, formatMessages } from 'esbuild';
import * as path from 'path';
import { OutputFileCache } from '../ng-package/nodes';
import * as log from '../utils/log';

/**
 * Options used in `ng-packagr` for writing flat bundle files.
 *
 * These options are passed through to rollup.
 */
export interface BundleOptions {
  moduleName: string;
  entry: string;
  outdir: string;
  entryName: string;
  buildContext?: BuildContext;
  fileCache: OutputFileCache;
  watch: boolean;
}

export async function bundle({ entryName, entry, watch, buildContext, outdir }: BundleOptions) {
  const dir = path.dirname(entry);
  const esbuildOptions: BuildOptions = {
    // Esbuild will try to locate a tsconfig from the project root.
    // Provide an empty one since we don't want to handle TS code here.
    tsconfigRaw: {},
    format: 'esm',
    outdir,
    bundle: true,
    logLevel: 'silent',
    minify: false,
    legalComments: 'eof',
    packages: 'external',
    write: true,
    entryPoints: [entry],
    resolveExtensions: ['.mjs', '.js'],
    preserveSymlinks: true,
    sourcemap: 'linked',
    absWorkingDir: dir,
    splitting: true,
    treeShaking: false,
    chunkNames: entryName + '-[name]-[hash]',
    entryNames: entryName,
    outExtension: { '.js': '.mjs' },
    charset: 'utf8',
  };

  let esbuildContext: BuildContext | undefined;
  if (watch) {
    esbuildContext = buildContext ?? (await context(esbuildOptions));
  }

  const { outputFiles, errors, warnings } = await (esbuildContext?.rebuild?.() ?? build(esbuildOptions));

  if (warnings.length > 0) {
    log.warn((await formatMessages(warnings, { kind: 'warning' })).join('\n'));
  }

  if (errors.length > 0) {
    log.error((await formatMessages(errors, { kind: 'error' })).join('\n'));

    throw new Error(`An error has occuried while processing ${entry}.`);
  }

  return {
    esbuildContext,
    outputFiles: outputFiles,
  };
}
