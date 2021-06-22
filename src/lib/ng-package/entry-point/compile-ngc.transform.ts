import * as path from 'path';
import * as ts from 'typescript';
import * as ora from 'ora';
import { Transform, transformFromPromise } from '../../graph/transform';
import { compileSourceFiles } from '../../ngc/compile-source-files';
import { NgccProcessor } from '../../ngc/ngcc-processor';
import * as ivy from '../../ivy';
import { setDependenciesTsConfigPaths } from '../../ts/tsconfig';
import { isEntryPointInProgress, EntryPointNode, isEntryPoint } from '../nodes';
import { StylesheetProcessor as StylesheetProcessorClass } from '../../styles/stylesheet-processor';
import { NgPackagrOptions } from '../options.di';

function isEnabled(variable: string | undefined): variable is string {
  return typeof variable === 'string' && (variable === '1' || variable.toLowerCase() === 'true');
}

export const compileNgcTransformFactory = (
  StylesheetProcessor: typeof StylesheetProcessorClass,
  options: NgPackagrOptions,
): Transform => {
  return transformFromPromise(async graph => {
    const spinner = ora({
      hideCursor: false,
      discardStdin: false,
    }).start(`Compiling TypeScript sources through NGC`);

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
      if (tsConfig.options.enableIvy !== false) {
        ngccProcessor = new NgccProcessor(ngccProcessingCache, tsConfig.project, tsConfig.options, entryPoints);
        if (!entryPoint.data.entryPoint.isSecondaryEntryPoint) {
          // Only run the async version of NGCC during the primary entrypoint processing.
          await ngccProcessor.process();
        }
      }

      if (tsConfig.options.enableIvy !== false && !isEnabled(process.env['NG_BUILD_LIB_LEGACY'])) {
        entryPoint.cache.stylesheetProcessor ??= new ivy.StylesheetProcessor(basePath, cssUrl, styleIncludePaths);

        await ivy.compileSourceFiles(
          graph,
          tsConfig,
          moduleResolutionCache,
          {
            outDir: path.dirname(esm2015),
            declarationDir: path.dirname(declarations),
            declaration: true,
            target: ts.ScriptTarget.ES2015,
          },
          entryPoint.cache.stylesheetProcessor as any,
          ngccProcessor,
          options.watch,
        );
      } else {
        entryPoint.cache.stylesheetProcessor ??= new StylesheetProcessor(basePath, cssUrl, styleIncludePaths);
        await compileSourceFiles(
          graph,
          tsConfig,
          moduleResolutionCache,
          entryPoint.cache.stylesheetProcessor as any,
          {
            outDir: path.dirname(esm2015),
            declarationDir: path.dirname(declarations),
            declaration: true,
            target: ts.ScriptTarget.ES2015,
          },
          ngccProcessor,
        );
      }
    } catch (error) {
      spinner.fail();
      throw error;
    }

    spinner.succeed();
    return graph;
  });
};
