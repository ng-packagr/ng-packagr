import { ParsedConfiguration } from '@angular/compiler-cli';
import chalk from 'chalk';
import { Transform, transformFromPromise } from '../../brocc/transform';
import { isEntryPoint, EntryPointNode } from '../nodes';
import { initializeTsConfig } from '../../ts/tsconfig';
import { msg } from '../../util/log';

export const initTsConfigTransformFactory = (defaultTsConfig: ParsedConfiguration): Transform =>
  transformFromPromise(async graph => {
    // Initialize tsconfig for each entry point
    const entryPoints = graph.filter(isEntryPoint) as EntryPointNode[];
    initializeTsConfig(defaultTsConfig, entryPoints);

    if (defaultTsConfig.options.enableIvy) {
      msg(chalk.yellow('\n** It is not recommended to publish Ivy libraries to NPM repositories **'));
    }

    return graph;
  });
