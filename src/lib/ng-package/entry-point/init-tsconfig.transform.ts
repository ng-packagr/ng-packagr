import { ParsedConfiguration } from '@angular/compiler-cli';
import { colors } from '../../utils/color';
import { Transform, transformFromPromise } from '../../graph/transform';
import { isEntryPoint, EntryPointNode } from '../nodes';
import { initializeTsConfig } from '../../ts/tsconfig';
import { msg } from '../../utils/log';

export const initTsConfigTransformFactory = (defaultTsConfig: ParsedConfiguration): Transform =>
  transformFromPromise(async graph => {
    // Initialize tsconfig for each entry point
    const entryPoints = graph.filter(isEntryPoint) as EntryPointNode[];
    initializeTsConfig(defaultTsConfig, entryPoints);

    if (defaultTsConfig.options.enableIvy) {
      const ivyMsg =
        '******************************************************************************\n' +
        'It is not recommended to publish Ivy libraries to NPM repositories.\n' +
        'Read more here: https://v9.angular.io/guide/ivy#maintaining-library-compatibility\n' +
        '******************************************************************************';

      msg(colors.yellow(ivyMsg));
    }

    return graph;
  });
