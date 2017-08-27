const __rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
import { debug } from '../util/log';
import { ROLLUP_GLOBALS } from '../conf/rollup.globals';

export interface RollupOptions {
  moduleName: string,
  entry: string,
  format: string,
  dest: string,
  externals: Object,
}

/**
 * Runs rollup over the given entry file, bundling it up.
 *
 * @param opts
 */
export const rollup = (opts: RollupOptions) => {

  const globals = {
    // default externals for '@angular/*' and 'rxjs'
    ...ROLLUP_GLOBALS,
    // external symbols passed from the user's ng-package.json
    ...opts.externals,
  };

  let bundleOptions = {
    context: 'this',
    external: Object.keys(globals),
    entry: opts.entry,
    plugins: [
        nodeResolve({ jsnext: true, module: true }),
    ],
    onwarn: (warning) => {
        if (warning.code === 'THIS_IS_UNDEFINED') {
          return;
        }

        console.warn(warning.message);
    }
  };

  let writeOptions = {
    // Keep the moduleId empty because we don't want to force developers to a specific moduleId.
    moduleId: '',
    moduleName: `${opts.moduleName}`,
    banner: '',
    format: opts.format,
    dest: opts.dest,
    globals: globals,
    sourceMap: true
  };

  debug(`rollup ${opts.entry} to ${opts.dest} (${opts.format})`);

  return __rollup.rollup(bundleOptions).then((bundle: any) => bundle.write(writeOptions));
}
