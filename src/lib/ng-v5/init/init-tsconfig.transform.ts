// XX: has or is using name 'ParsedConfiguration' ... but cannot be named
import { ParsedConfiguration } from '@angular/compiler-cli/src/perform_compile';
import { Transform, transformFromPromise } from '../../brocc/transform';
import { TsConfig, initializeTsConfig } from '../../ts/tsconfig';
import { isEntryPoint, EntryPointNode } from '../nodes';

export const initTsConfigTransformFactory = (defaultTsConfig: TsConfig): Transform =>
  transformFromPromise(async graph => {
    // Initialize tsconfig for each entry point
    const entryPoints = graph.filter(isEntryPoint) as EntryPointNode[];
    initializeTsConfig(defaultTsConfig, entryPoints);
    return graph;
  });
