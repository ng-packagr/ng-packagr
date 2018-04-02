import * as path from 'path';
import { Transform, transformFromPromise } from '../../../brocc/transform';
import { compileSourceFiles } from '../../../ngc/compile-source-files';
import { TsConfig } from '../../../ts/tsconfig';
import * as log from '../../../util/log';
import {
  isEntryPointInProgress,
  isTypeScriptSources,
  TypeScriptSourceNode,
  isEntryPoint,
  EntryPointNode
} from '../../nodes';

export const compileNgcTransform: Transform = transformFromPromise(async graph => {
  log.info(`Compiling TypeScript sources through ngc`);
  const entryPoint = graph.find(isEntryPointInProgress()) as EntryPointNode;
  const tsSources = entryPoint.find(isTypeScriptSources) as TypeScriptSourceNode;
  const tsConfig: TsConfig = entryPoint.data.tsConfig;

  // Add paths mappings for dependencies
  const entryPointDeps = entryPoint.filter(isEntryPoint) as EntryPointNode[];
  if (entryPointDeps.length > 0) {
    if (!tsConfig.options.paths) {
      tsConfig.options.paths = {};
    }

    for (let dep of entryPointDeps) {
      const { entryPoint, destinationFiles } = dep.data;
      const depModuleId = entryPoint.moduleId;
      const mappedPath = [destinationFiles.declarations];

      if (!tsConfig.options.paths[depModuleId]) {
        tsConfig.options.paths[depModuleId] = mappedPath;
      } else {
        tsConfig.options.paths[depModuleId].concat(mappedPath);
      }
    }
  }

  // Compile TypeScript sources
  const { esm2015, declarations } = entryPoint.data.destinationFiles;
  const previousTransform = tsSources.data;
  await compileSourceFiles(tsSources.data.transformed, tsConfig, path.dirname(esm2015), path.dirname(declarations));
  previousTransform.dispose();

  return graph;
});
