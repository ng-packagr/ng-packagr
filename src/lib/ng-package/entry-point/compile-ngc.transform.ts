import ora from 'ora';
import * as path from 'path';
import ts from 'typescript';
import { Transform, transformFromPromise } from '../../graph/transform';
import { compileSourceFiles } from '../../ngc/compile-source-files';
import { NgccProcessor } from '../../ngc/ngcc-processor';
import { StylesheetProcessor as StylesheetProcessorClass } from '../../styles/stylesheet-processor';
import { setDependenciesTsConfigPaths } from '../../ts/tsconfig';
import { ngccCompilerCli } from '../../utils/ng-compiler-cli';
import { EntryPointNode, isEntryPoint, isEntryPointInProgress } from '../nodes';
import { NgPackagrOptions } from '../options.di';

export const compileNgcTransformFactory = (
  StylesheetProcessor: typeof StylesheetProcessorClass,
  options: NgPackagrOptions,
): Transform => {
  return transformFromPromise(async graph => {
    const spinner = ora({
      hideCursor: false,
      discardStdin: false,
    });

    try {
      const entryPoint: EntryPointNode = graph.find(isEntryPointInProgress());
      const entryPoints: EntryPointNode[] = graph.filter(isEntryPoint);
      // Add paths mappings for dependencies
      const tsConfig = setDependenciesTsConfigPaths(entryPoint.data.tsConfig, entryPoints);

      // Compile TypeScript sources
      const { esm2020, declarations } = entryPoint.data.destinationFiles;
      const { basePath, cssUrl, styleIncludePaths } = entryPoint.data.entryPoint;
      const { moduleResolutionCache, ngccProcessingCache } = entryPoint.cache;

      spinner.start(
        `Compiling with Angular sources in Ivy ${tsConfig.options.compilationMode || 'full'} compilation mode.`,
      );
      const ngccProcessor = new NgccProcessor(
        await ngccCompilerCli(),
        ngccProcessingCache,
        tsConfig.project,
        tsConfig.options,
        entryPoints,
      );
      if (!entryPoint.data.entryPoint.isSecondaryEntryPoint) {
        // Only run the async version of NGCC during the primary entrypoint processing.
        await ngccProcessor.process();
      }

      entryPoint.cache.stylesheetProcessor ??= new StylesheetProcessor(
        basePath,
        cssUrl,
        styleIncludePaths,
        options.cacheEnabled && options.cacheDirectory,
      );

      await compileSourceFiles(
        graph,
        tsConfig,
        moduleResolutionCache,
        {
          outDir: path.dirname(esm2020),
          declarationDir: path.dirname(declarations),
          declaration: true,
          target: ts.ScriptTarget.ES2020,
        },
        entryPoint.cache.stylesheetProcessor,
        ngccProcessor,
        options.watch,
      );
    } catch (error) {
      spinner.fail();
      throw error;
    }

    spinner.succeed();

    return graph;
  });
};
