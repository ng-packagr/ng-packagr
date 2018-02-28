import { ParsedConfiguration } from '@angular/compiler-cli';
import { BuildGraph } from '../../brocc/build-graph';
import { Node } from '../../brocc/node';
import { Transform, transformFromPromise } from '../../brocc/transform';
import { TsConfig, initializeTsConfig } from '../../ts/tsconfig';
import * as log from '../../util/log';
import { isEntryPointInProgress, isEntryPoint } from '../nodes';

export const initTsConfigTransformFactory = (defaultTsConfig: TsConfig): Transform =>
  transformFromPromise(async graph => {
    // Initialize tsconfig for each entry point
    const entryPoints = graph.filter(isEntryPoint);
    for (let entryPoint of entryPoints) {
      log.debug(`Initializing tsconfig for ${entryPoint.data.entryPoint.moduleId}`);
      const tsConfig = initializeTsConfig(defaultTsConfig, entryPoint.data.entryPoint, entryPoint.data.outDir);
      entryPoint.data.tsConfig = tsConfig;
    }

    return graph;
  });
