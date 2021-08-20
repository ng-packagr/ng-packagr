import * as path from 'path';
import * as ts from 'typescript';
import * as ora from 'ora';
import { Transform, transformFromPromise } from '../../graph/transform';
import { NgccProcessor } from '../../ngc/ngcc-processor';
import { setDependenciesTsConfigPaths } from '../../ts/tsconfig';
import { isEntryPointInProgress, EntryPointNode, isEntryPoint } from '../nodes';
import { StylesheetProcessor as StylesheetProcessorClass } from '../../styles/stylesheet-processor';
import { NgPackagrOptions } from '../options.di';
import { compileSourceFiles } from '../../ngc/compile-source-files';

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
      const { esm2015, declarations } = entryPoint.data.destinationFiles;
      const { basePath, cssUrl, styleIncludePaths } = entryPoint.data.entryPoint;
      const { moduleResolutionCache, ngccProcessingCache } = entryPoint.cache;

      let ngccProcessor: NgccProcessor | undefined;
      spinner.start(
        `Compiling with Angular sources in Ivy ${tsConfig.options.compilationMode || 'full'} compilation mode.`,
      );
      ngccProcessor = new NgccProcessor(ngccProcessingCache, tsConfig.project, tsConfig.options, entryPoints);
      if (!entryPoint.data.entryPoint.isSecondaryEntryPoint) {
        // Only run the async version of NGCC during the primary entrypoint processing.
        await ngccProcessor.process();
      }

      entryPoint.cache.stylesheetProcessor ??= new StylesheetProcessor(basePath, cssUrl, styleIncludePaths);

      await compileSourceFiles(
        graph,
        tsConfig,
        moduleResolutionCache,
        {
          outDir: path.dirname(esm2015),
          declarationDir: path.dirname(declarations),
          declaration: true,
          target: ts.ScriptTarget.ES2015,
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
