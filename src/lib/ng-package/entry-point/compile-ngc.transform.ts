import ora from 'ora';
import * as path from 'path';
import ts from 'typescript';
import { Transform, transformFromPromise } from '../../graph/transform';
import { compileSourceFiles } from '../../ngc/compile-source-files';
import { StylesheetProcessor as StylesheetProcessorClass } from '../../styles/stylesheet-processor';
import { setDependenciesTsConfigPaths } from '../../ts/tsconfig';
import { EntryPointNode, PackageNode, isEntryPoint, isEntryPointInProgress, isPackage } from '../nodes';
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

    const entryPoints: EntryPointNode[] = graph.filter(isEntryPoint);
    const entryPoint: EntryPointNode = entryPoints.find(isEntryPointInProgress());
    const ngPackageNode: PackageNode = graph.find(isPackage);
    const projectBasePath = ngPackageNode.data.primary.basePath;

    try {
      // Add paths mappings for dependencies
      const tsConfig = setDependenciesTsConfigPaths(entryPoint.data.tsConfig, entryPoints);

      // Compile TypeScript sources
      const { esm2020, declarations } = entryPoint.data.destinationFiles;
      const { basePath, cssUrl, styleIncludePaths } = entryPoint.data.entryPoint;
      const { moduleResolutionCache } = entryPoint.cache;

      spinner.start(
        `Compiling with Angular sources in Ivy ${tsConfig.options.compilationMode || 'full'} compilation mode.`,
      );

      entryPoint.cache.stylesheetProcessor ??= new StylesheetProcessor(
        projectBasePath,
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
        options.watch,
      );
    } catch (error) {
      spinner.fail();
      throw error;
    } finally {
      if (!options.watch) {
        entryPoint.cache.stylesheetProcessor?.destroy();
      }
    }

    spinner.succeed();

    return graph;
  });
};
