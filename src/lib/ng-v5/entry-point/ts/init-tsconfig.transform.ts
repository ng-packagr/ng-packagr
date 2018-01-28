import { ParsedConfiguration } from '@angular/compiler-cli';
import { BuildGraph } from '../../../brocc/build-graph';
import { Node } from '../../../brocc/node';
import { Transform, transformFromPromise } from '../../../brocc/transform';
import { TsConfig, initializeTsConfig } from '../../../ts/tsconfig';
import * as log from '../../../util/log';
import { byEntryPoint, isInProgress } from '../../entry-point.node';

export const initTsConfigTransformFactory = (defaultTsConfig: TsConfig): Transform =>
  transformFromPromise(async graph => {
    log.debug(`Initializing tsconfig`);

    // Peek the first entry point from the graph
    const entryPoint = graph.find(byEntryPoint().and(isInProgress));

    const tsConfig = initializeTsConfig(defaultTsConfig, entryPoint.data.entryPoint, entryPoint.data.outDir);

    entryPoint.data.tsConfig = tsConfig;

    return graph;
  });
