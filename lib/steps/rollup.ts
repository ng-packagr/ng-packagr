const __rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
import { debug } from '../util/log';

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
  const ROLLUP_GLOBALS = {
    // Angular dependencies
    '@angular/animations':  'ng.animations',
    '@angular/core':        'ng.core',
    '@angular/common':      'ng.common',
    '@angular/forms':       'ng.forms',
    '@angular/http':        'ng.http',
    '@angular/platform-browser':            'ng.platformBrowser',
    '@angular/platform-browser-dynamic':    'ng.platformBrowserDynamic',
    '@angular/platform-browser/animations': 'ng.platformBrowser.animations',
    '@angular/router':      'ng.router',

    ...opts.externals,
  };

  let bundleOptions = {
    context: 'this',
    external: Object.keys(ROLLUP_GLOBALS),
    entry: opts.entry,
    plugins: [
        nodeResolve({ jsnext: true, module: true }),
        commonjs({
          include: 'node_modules/**'
        }),
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
    globals: ROLLUP_GLOBALS,
    sourceMap: true
  };

  debug(`rollup ${opts.entry} to ${opts.dest} (${opts.format})`);

  return __rollup.rollup(bundleOptions).then((bundle: any) => bundle.write(writeOptions));
}
