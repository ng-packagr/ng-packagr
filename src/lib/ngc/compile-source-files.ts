import * as ng from '@angular/compiler-cli';
import * as ts from 'typescript';
import * as log from '../utils/log';
import { redirectWriteFileCompilerHost } from '../ts/redirect-write-file-compiler-host';
import { cacheCompilerHost } from '../ts/cache-compiler-host';
import { StylesheetProcessor } from '../styles/stylesheet-processor';
import { BuildGraph } from '../graph/build-graph';
import { EntryPointNode, isEntryPointInProgress } from '../ng-package/nodes';
import { NgccProcessor } from './ngcc-processor';
import { ngccTransformCompilerHost } from '../ts/ngcc-transform-compiler-host';
import { createEmitCallback } from './create-emit-callback';

export async function compileSourceFiles(
  graph: BuildGraph,
  tsConfig: ng.ParsedConfiguration,
  moduleResolutionCache: ts.ModuleResolutionCache,
  stylesheetProcessor: StylesheetProcessor,
  extraOptions?: Partial<ng.CompilerOptions>,
  declarationDir?: string,
  ngccProcessor?: NgccProcessor,
) {
  log.debug(`ngc (v${ng.VERSION.full})`);

  const tsConfigOptions: ng.CompilerOptions = { ...tsConfig.options, ...extraOptions };
  const entryPoint = graph.find(isEntryPointInProgress()) as EntryPointNode;

  let tsCompilerHost = cacheCompilerHost(
    graph,
    entryPoint,
    tsConfigOptions,
    moduleResolutionCache,
    stylesheetProcessor,
  );
  if (declarationDir) {
    tsCompilerHost = redirectWriteFileCompilerHost(tsCompilerHost, tsConfigOptions.basePath, declarationDir);
  }

  if (tsConfigOptions.enableIvy && ngccProcessor) {
    tsCompilerHost = ngccTransformCompilerHost(tsCompilerHost, tsConfigOptions, ngccProcessor, moduleResolutionCache);
  }

  // ng.CompilerHost
  const ngCompilerHost = ng.createCompilerHost({
    options: tsConfigOptions,
    tsHost: tsCompilerHost,
  });

  const scriptTarget = tsConfigOptions.target;
  const cache = entryPoint.cache;
  const oldProgram = cache.oldPrograms && (cache.oldPrograms[scriptTarget] as ng.Program | undefined);

  const ngProgram = ng.createProgram({
    rootNames: tsConfig.rootNames,
    options: tsConfigOptions,
    host: ngCompilerHost,
    oldProgram,
  });

  await ngProgram.loadNgStructureAsync();

  log.debug(
    `ngc program structure is reused: ${
      oldProgram ? (oldProgram.getTsProgram() as any).structureIsReused : 'No old program'
    }`,
  );

  cache.oldPrograms = { ...cache.oldPrograms, [scriptTarget]: ngProgram };

  const allDiagnostics = [
    ...ngProgram.getTsOptionDiagnostics(),
    ...ngProgram.getNgOptionDiagnostics(),
    ...ngProgram.getTsSyntacticDiagnostics(),
    ...ngProgram.getTsSemanticDiagnostics(),
    ...ngProgram.getNgSemanticDiagnostics(),
    ...ngProgram.getNgStructuralDiagnostics(),
  ];

  // if we have an error we don't want to transpile.
  const hasError = ng.exitCodeFromResult(allDiagnostics) > 0;
  if (!hasError) {
    const emitFlags = tsConfigOptions.declaration ? tsConfig.emitFlags : ng.EmitFlags.JS;
    // certain errors are only emitted by a compilation hence append to previous diagnostics
    const { diagnostics } = ngProgram.emit({
      emitFlags,
      // For Ivy we don't need a custom emitCallback to have tsickle transforms
      emitCallback: tsConfigOptions.enableIvy ? undefined : createEmitCallback(tsConfigOptions),
    });

    allDiagnostics.push(...diagnostics);
  }

  if (allDiagnostics.length === 0) {
    return;
  }

  const exitCode = ng.exitCodeFromResult(allDiagnostics);
  const formattedDiagnostics = ng.formatDiagnostics(allDiagnostics);
  if (exitCode !== 0) {
    throw new Error(formattedDiagnostics);
  } else {
    log.msg(formattedDiagnostics);
  }
}
