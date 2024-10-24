import ora from 'ora';
import * as path from 'path';
import ts from 'typescript';
import { EntryPointTransform, transformEntryPointFromPromise } from '../../graph/entry-point-transform';
import { compileSourceFiles } from '../../ngc/compile-source-files';
import { StylesheetProcessor as StylesheetProcessorClass } from '../../styles/stylesheet-processor';
import { setDependenciesTsConfigPaths } from '../../ts/tsconfig';
import { EntryPointNode, PackageNode, isEntryPoint, isPackage } from '../nodes';
import { NgPackagrOptions } from '../options.di';

export const compileNgcTransformFactory = (
  StylesheetProcessor: typeof StylesheetProcessorClass,
  options: NgPackagrOptions,
): EntryPointTransform => {
  return transformEntryPointFromPromise(async (entryPoint, graph) => {
    const spinner = ora({
      hideCursor: false,
      discardStdin: false,
    });

    const entryPoints: EntryPointNode[] = [];
    let ngPackageNode: PackageNode;

    for (const node of graph.values()) {
      if (isEntryPoint(node)) {
        entryPoints.push(node);
      } else if (isPackage(node)) {
        ngPackageNode = node;
      }
    }

    const projectBasePath = ngPackageNode.data.primary.basePath;

    try {
      // Add paths mappings for dependencies
      const tsConfig = setDependenciesTsConfigPaths(entryPoint.data.tsConfig, entryPoints);

      // Compile TypeScript sources
      const { esm2022: esm2022, declarations } = entryPoint.data.destinationFiles;
      const { basePath, cssUrl, styleIncludePaths, sass } = entryPoint.data.entryPoint;
      const { moduleResolutionCache } = entryPoint.cache;

      spinner.start(
        `Compiling with Angular sources in Ivy ${tsConfig.options.compilationMode || 'full'} compilation mode.`,
      );

      entryPoint.cache.stylesheetProcessor ??= new StylesheetProcessor(
        projectBasePath,
        basePath,
        cssUrl,
        styleIncludePaths,
        sass,
        options.cacheEnabled && options.cacheDirectory,
        options.watch,
      );

      await compileSourceFiles(
        graph,
        entryPoint,
        tsConfig,
        moduleResolutionCache,
        options,
        {
          outDir: path.dirname(esm2022),
          declarationDir: path.dirname(declarations),
          declaration: true,
          target: ts.ScriptTarget.ES2022,
        },
        entryPoint.cache.stylesheetProcessor,
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
  });
};
