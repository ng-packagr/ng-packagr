import * as path from 'path';
import { Transform, transformFromPromise } from '../../../brocc/transform';
import { compileSourceFiles } from '../../../ngc/compile-source-files';
import { TsConfig } from '../../../ts/tsconfig';
import * as log from '../../../util/log';
import { isEntryPointInProgress, isTypeScriptSources, TypeScriptSourceNode, isEntryPoint } from '../../nodes';

export const compileNgcTransform: Transform = transformFromPromise(async graph => {
  log.info(`Compiling TypeScript sources through ngc`);
  const entryPoint = graph.find(isEntryPointInProgress());
  const tsSources: TypeScriptSourceNode = entryPoint.find(isTypeScriptSources) as TypeScriptSourceNode;
  const tsConfig: TsConfig = entryPoint.data.tsConfig;

  // Add paths mappings for dependencies
  const entryPointDeps = entryPoint.filter(isEntryPoint);
  if (entryPointDeps.length > 0) {
    if (!tsConfig.options.paths) {
      tsConfig.options.paths = {};
    }

    for (let dep of entryPointDeps) {
      const depModuleId = dep.data.entryPoint.moduleId;

      if (!tsConfig.options.paths[depModuleId]) {
        tsConfig.options.paths[depModuleId] = [];
      }
      tsConfig.options.paths[depModuleId].push(path.resolve(
        path.dirname(dep.data.es2015EntryFile),
        path.basename(dep.data.es2015EntryFile, '.js')
      ));
    }
  }

  // Compile TypeScript sources
  const previousTransform = tsSources.data;
  const compilationResult = await compileSourceFiles(tsSources.data.transformed, tsConfig, entryPoint.data.outDir);
  previousTransform.dispose();

  // Store compilation result on the graph for further processing (`writeFlatBundles`)
  entryPoint.data.es2015EntryFile = compilationResult.js;
  entryPoint.data.typings = compilationResult.typings;
  entryPoint.data.metadata = compilationResult.metadata;

  return graph;
});
