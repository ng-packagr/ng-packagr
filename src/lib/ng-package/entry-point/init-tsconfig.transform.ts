import { ParsedConfiguration } from '@angular/compiler-cli';
import { Transform, transformFromPromise } from '../../graph/transform';
import { isEntryPoint, EntryPointNode } from '../nodes';
import { initializeTsConfig } from '../../ts/tsconfig';

export const initTsConfigTransformFactory = (defaultTsConfig: ParsedConfiguration): Transform =>
  transformFromPromise(async graph => {
    // Initialize tsconfig for each entry point
    const entryPoints: EntryPointNode[] = graph.filter(isEntryPoint);
    initializeTsConfig(defaultTsConfig, entryPoints);

    return graph;
  });
