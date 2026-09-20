import type { ParsedConfiguration } from '@angular/compiler-cli';
import { BuildGraph } from '../../graph/build-graph';
import { PromiseBasedTransform, Transform, transformFromPromise } from '../../graph/transform';
import { initializeTsConfig } from '../../ts/tsconfig';
import { EntryPointNode, isEntryPoint } from '../nodes';

export const initTsConfigTransformFactory = (defaultTsConfig: ParsedConfiguration | string | undefined): Transform =>
  transformFromPromise(initTsConfigTransformFactory2(defaultTsConfig));

export const initTsConfigTransformFactory2 = (defaultTsConfig: ParsedConfiguration | string | undefined): PromiseBasedTransform => {
  return async (graph: BuildGraph): Promise<void> => {
    // Initialize tsconfig for each entry point
    const entryPoints: EntryPointNode[] = graph.filter(isEntryPoint);

    // Aufruf der asynchronen Funktion (falls initializeTsConfig ein Promise zurückgibt)
    await initializeTsConfig(defaultTsConfig, entryPoints);
  };
};
