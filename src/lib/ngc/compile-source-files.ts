import { CompilerOptions, ParsedConfiguration } from '@angular/compiler-cli';
import { join } from 'node:path';
import ts from 'typescript';
import { BuildGraph } from '../graph/build-graph';
import { EntryPointNode, PackageNode, isEntryPointInProgress, isPackage } from '../ng-package/nodes';
import { NgPackagrOptions } from '../ng-package/options.di';
import { StylesheetProcessor } from '../styles/stylesheet-processor';
import { augmentProgramWithVersioning, cacheCompilerHost } from '../ts/cache-compiler-host';
import * as log from '../utils/log';
import { ngCompilerCli } from '../utils/ng-compiler-cli';

export async function compileSourceFiles(
  graph: BuildGraph,
  tsConfig: ParsedConfiguration,
  moduleResolutionCache: ts.ModuleResolutionCache,
  options: NgPackagrOptions,
  extraOptions?: Partial<CompilerOptions>,
  stylesheetProcessor?: StylesheetProcessor,
) {
  const { NgtscProgram, formatDiagnostics } = await ngCompilerCli();
  const { cacheDirectory, watch, cacheEnabled } = options;
  const tsConfigOptions: CompilerOptions = { ...tsConfig.options, ...extraOptions };
  const entryPoint: EntryPointNode = graph.find(isEntryPointInProgress());
  const ngPackageNode: PackageNode = graph.find(isPackage);
  const inlineStyleLanguage = ngPackageNode.data.inlineStyleLanguage;

  const cacheDir = cacheEnabled && cacheDirectory;
  if (cacheDir) {
    tsConfigOptions.incremental ??= true;
    tsConfigOptions.tsBuildInfoFile ??= join(
      cacheDir,
      `tsbuildinfo/${entryPoint.data.entryPoint.flatModuleFile}.tsbuildinfo`,
    );
  }

  const emittedFiles = new Set<string>();
  const tsCompilerHost = cacheCompilerHost(
    graph,
    entryPoint,
    tsConfigOptions,
    moduleResolutionCache,
    emittedFiles,
    stylesheetProcessor,
    inlineStyleLanguage,
  );

  const cache = entryPoint.cache;
  const sourceFileCache = cache.sourcesFileCache;
  let usingBuildInfo = false;

  let oldBuilder = cache.oldBuilder;
  if (!oldBuilder && cacheDir) {
    oldBuilder = ts.readBuilderProgram(tsConfigOptions, tsCompilerHost);
    usingBuildInfo = true;
  }

  // Create the Angular specific program that contains the Angular compiler
  const angularProgram = new NgtscProgram(tsConfig.rootNames, tsConfigOptions, tsCompilerHost, cache.oldNgtscProgram);

  const angularCompiler = angularProgram.compiler;
  const { ignoreForDiagnostics, ignoreForEmit } = angularCompiler;

  // SourceFile versions are required for builder programs.
  // The wrapped host inside NgtscProgram adds additional files that will not have versions.
  const typeScriptProgram = angularProgram.getTsProgram();
  augmentProgramWithVersioning(typeScriptProgram);

  let builder: ts.BuilderProgram | ts.EmitAndSemanticDiagnosticsBuilderProgram;
  if (watch || cacheDir) {
    builder = cache.oldBuilder = ts.createEmitAndSemanticDiagnosticsBuilderProgram(
      typeScriptProgram,
      tsCompilerHost,
      oldBuilder,
    );
    cache.oldNgtscProgram = angularProgram;
  } else {
    // When not in watch mode, the startup cost of the incremental analysis can be avoided by
    // using an abstract builder that only wraps a TypeScript program.
    builder = ts.createAbstractBuilder(typeScriptProgram, tsCompilerHost);
  }

  // Update semantic diagnostics cache
  const affectedFiles = new Set<ts.SourceFile>();

  // Analyze affected files when in watch mode for incremental type checking
  if ('getSemanticDiagnosticsOfNextAffectedFile' in builder) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const result = builder.getSemanticDiagnosticsOfNextAffectedFile(undefined, sourceFile => {
        // If the affected file is a TTC shim, add the shim's original source file.
        // This ensures that changes that affect TTC are typechecked even when the changes
        // are otherwise unrelated from a TS perspective and do not result in Ivy codegen changes.
        // For example, changing @Input property types of a directive used in another component's
        // template.
        if (ignoreForDiagnostics.has(sourceFile) && sourceFile.fileName.endsWith('.ngtypecheck.ts')) {
          // This file name conversion relies on internal compiler logic and should be converted
          // to an official method when available. 15 is length of `.ngtypecheck.ts`
          const originalFilename = sourceFile.fileName.slice(0, -15) + '.ts';
          const originalSourceFile = builder.getSourceFile(originalFilename);
          if (originalSourceFile) {
            affectedFiles.add(originalSourceFile);
          }

          return true;
        }

        return false;
      });

      if (!result) {
        break;
      }

      affectedFiles.add(result.affected as ts.SourceFile);
    }

    // Add all files with associated template type checking files.
    // Stored TS build info does not have knowledge of the AOT compiler or the typechecking state of the templates.
    // To ensure that errors are reported correctly, all AOT component diagnostics need to be analyzed even if build
    // info is present.
    if (usingBuildInfo) {
      for (const sourceFile of builder.getSourceFiles()) {
        if (ignoreForDiagnostics.has(sourceFile) && sourceFile.fileName.endsWith('.ngtypecheck.ts')) {
          // This file name conversion relies on internal compiler logic and should be converted
          // to an official method when available. 15 is length of `.ngtypecheck.ts`
          const originalFilename = sourceFile.fileName.slice(0, -15) + '.ts';
          const originalSourceFile = builder.getSourceFile(originalFilename);
          if (originalSourceFile) {
            affectedFiles.add(originalSourceFile);
          }
        }
      }
    }
  }

  // Collect program level diagnostics
  const allDiagnostics: ts.Diagnostic[] = [
    ...angularCompiler.getOptionDiagnostics(),
    ...builder.getOptionsDiagnostics(),
    ...builder.getGlobalDiagnostics(),
  ];

  // Required to support asynchronous resource loading
  // Must be done before creating transformers or getting template diagnostics
  await angularCompiler.analyzeAsync();

  // Collect source file specific diagnostics
  for (const sourceFile of builder.getSourceFiles()) {
    if (ignoreForDiagnostics.has(sourceFile)) {
      continue;
    }

    allDiagnostics.push(
      ...builder.getDeclarationDiagnostics(sourceFile),
      ...builder.getSyntacticDiagnostics(sourceFile),
      ...builder.getSemanticDiagnostics(sourceFile),
    );

    // Declaration files cannot have template diagnostics
    if (sourceFile.isDeclarationFile) {
      continue;
    }

    // Only request Angular template diagnostics for affected files to avoid
    // overhead of template diagnostics for unchanged files.
    if (affectedFiles.has(sourceFile)) {
      const angularDiagnostics = angularCompiler.getDiagnosticsForFile(
        sourceFile,
        affectedFiles.size === 1 ? /** OptimizeFor.SingleFile **/ 0 : /** OptimizeFor.WholeProgram */ 1,
      );

      allDiagnostics.push(...angularDiagnostics);
      sourceFileCache.updateAngularDiagnostics(sourceFile, angularDiagnostics);
    }
  }

  const otherDiagnostics = [];
  const errorDiagnostics = [];
  for (const diagnostic of allDiagnostics) {
    if (diagnostic.category === ts.DiagnosticCategory.Error) {
      errorDiagnostics.push(diagnostic);
    } else {
      otherDiagnostics.push(diagnostic);
    }
  }

  if (otherDiagnostics.length) {
    log.msg(formatDiagnostics(errorDiagnostics));
  }

  const transformers = angularCompiler.prepareEmit().transformers;
  if ('getSemanticDiagnosticsOfNextAffectedFile' in builder) {
    // TypeScript will loop until there are no more affected files in the program
    while (builder.emitNextAffectedFile(undefined, undefined, undefined, transformers)) {
      // empty
    }
  }

  if (errorDiagnostics.length) {
    throw new Error(formatDiagnostics(errorDiagnostics));
  }

  for (const sourceFile of builder.getSourceFiles()) {
    if (ignoreForEmit.has(sourceFile)) {
      continue;
    }

    if (emittedFiles.has(sourceFile.fileName)) {
      angularCompiler.incrementalCompilation.recordSuccessfulEmit(sourceFile);
      continue;
    }

    if (angularCompiler.incrementalCompilation.safeToSkipEmit(sourceFile)) {
      continue;
    }

    builder.emit(sourceFile, undefined, undefined, undefined, transformers);
    angularCompiler.incrementalCompilation.recordSuccessfulEmit(sourceFile);
  }
}
