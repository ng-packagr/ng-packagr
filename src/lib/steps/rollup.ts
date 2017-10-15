import * as  __rollup from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';
import * as commonJs from 'rollup-plugin-commonjs';
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
export async function rollup(opts: RollupOptions): Promise<void> {

  const globals = {
    // default externals for '@angular/*' and 'rxjs'
    ...ROLLUP_GLOBALS,
    // external symbols passed from the user's ng-package.json
    ...opts.externals,
  };

  let bundleOptions = {
    context: 'this',
    external: Object.keys(globals),
    input: opts.entry,
    plugins: [
      nodeResolve({ jsnext: true, module: true }),
      commonJs(),
    ],
    onwarn: (warning) => {
      if (warning.code === 'THIS_IS_UNDEFINED') {
        return;
      }

      console.warn(warning.message);
    }
  };

  const writeOptions = {
    // Keep the moduleId empty because we don't want to force developers to a specific moduleId.
    moduleId: '',
    name: `${opts.moduleName}`,
    file: opts.dest,
    format: opts.format,
    banner: '',
    globals: globals,
    sourcemap: true
  };

  debug(`rollup ${opts.entry} to ${opts.dest} (${opts.format})`);

  const bundle: any = await __rollup.rollup(bundleOptions);
  await bundle.write(writeOptions);
}
