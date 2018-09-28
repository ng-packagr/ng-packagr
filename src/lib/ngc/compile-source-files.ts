import * as ng from '@angular/compiler-cli';
import * as ts from 'typescript';
import * as log from '../util/log';
import { createEmitCallback } from './create-emit-callback';
import { redirectWriteFileCompilerHost } from '../ts/redirect-write-file-compiler-host';
import { cacheCompilerHost } from '../ts/cache-compiler-host';
import { StylesheetProcessor } from '../ng-v5/entry-point/resources/stylesheet-processor';
import { BuildGraph } from '../brocc/build-graph';
import { EntryPointNode } from '../ng-v5/nodes';

export async function compileSourceFiles(
  graph: BuildGraph,
  entryPoint: EntryPointNode,
  tsConfig: ng.ParsedConfiguration,
  moduleResolutionCache: ts.ModuleResolutionCache,
  stylesheetProcessor: StylesheetProcessor,
  extraOptions?: Partial<ng.CompilerOptions>,
  declarationDir?: string
) {
  log.debug(`ngc (v${ng.VERSION.full})`);

  const tsConfigOptions: ng.CompilerOptions = { ...tsConfig.options, ...extraOptions };

  let tsCompilerHost = cacheCompilerHost(
    graph,
    entryPoint,
    tsConfigOptions,
    moduleResolutionCache,
    stylesheetProcessor
  );
  if (declarationDir) {
    tsCompilerHost = redirectWriteFileCompilerHost(tsCompilerHost, tsConfigOptions.basePath, declarationDir);
  }

  // ng.CompilerHost
  const ngCompilerHost = ng.createCompilerHost({
    options: tsConfigOptions,
    tsHost: tsCompilerHost
  });

  // Don't use `ng.emit` as it doesn't output all errors.
  // https://github.com/angular/angular/issues/24024
  const emitFlags = tsConfigOptions.declaration ? tsConfig.emitFlags : ng.EmitFlags.JS;

  const result = ng.performCompilation({
    rootNames: tsConfig.rootNames,
    options: tsConfigOptions,
    host: ngCompilerHost,
    emitCallback: createEmitCallback(tsConfigOptions),
    emitFlags
  });

  const exitCode = ng.exitCodeFromResult(result.diagnostics);
  return exitCode === 0 ? Promise.resolve() : Promise.reject(new Error(ng.formatDiagnostics(result.diagnostics)));
}
