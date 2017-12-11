import * as  __rollup from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';
import * as commonJs from 'rollup-plugin-commonjs';
import * as path from 'path';
import * as log from '../util/log';

export type BundleFormat = __rollup.Format;

export interface RollupOptions {
  moduleName: string,
  entry: string,
  format: BundleFormat,
  dest: string,
  umdModuleIds?: { [key: string]: string },
  embedded?: string[]
}

export const externalModuleIdStrategy = (moduleId: string, embedded: string[] = []): boolean => {
  // more information about why we don't check for 'node_modules' path
  // https://github.com/rollup/rollup-plugin-node-resolve/issues/110#issuecomment-350353632
  if (
    path.isAbsolute(moduleId) ||
    moduleId.startsWith(".") ||
    moduleId.startsWith("/") ||
    moduleId.indexOf("commonjsHelpers") >= 0 || // in case we are embedding a commonjs module we need to include it's helpers also
    embedded.some(x => x === moduleId)
  ) {
    // if it's either 'absolute', marked to embed, starts with a '.' or '/' it's not external
    return false;
  }

  return true;
}

export const umdModuleIdStrategy = (moduleId: string, umdModuleIds: { [key: string]: string } = {}): string => {
  let nameProvided: string | undefined;
  if (nameProvided = umdModuleIds[moduleId]) {
    return nameProvided;
  }

  let regMatch;
  if (regMatch = /^\@angular\/platform-browser-dynamic(\/?.*)/.exec(moduleId)) {
    return `ng.platformBrowserDynamic${regMatch[1]}`.replace("/", ".")
  }

  if (regMatch = /^\@angular\/platform-browser(\/?.*)/.exec(moduleId)) {
    return `ng.platformBrowser${regMatch[1]}`.replace("/", ".")
  }

  if (regMatch = /^\@angular\/(.+)/.exec(moduleId)) {
    return `ng.${regMatch[1]}`.replace("/", ".")
  }

  if (/^rxjs\/(add\/)?observable/.test(moduleId)) {
    return "Rx.Observable";
  }

  if (/^rxjs\/scheduler/.test(moduleId)) {
    return "Rx.Scheduler";
  }

  if (/^rxjs\/symbol/.test(moduleId)) {
    return "Rx.Symbol";
  }

  if (/^rxjs\/(add\/)?operator/.test(moduleId)) {
    return "Rx.Observable.prototype";
  }

  if (/^rxjs\/[^\/]+$/.test(moduleId)) {
    return "Rx";
  }

  return ''; // leave it up to rollup to guess the global name
}

/**
 * Runs rollup over the given entry file, bundling it up.
 *
 * @param opts
 */
export async function rollup(opts: RollupOptions): Promise<void> {
  log.debug(`rollup (v${__rollup.VERSION}) ${opts.entry} to ${opts.dest} (${opts.format})`);

  // Create the bundle
  const bundle: __rollup.Bundle = await __rollup.rollup({
    context: 'this',
    external: moduleId => externalModuleIdStrategy(moduleId, opts.embedded),
    input: opts.entry,
    plugins: [
      nodeResolve({ jsnext: true, module: true }),
      commonJs(),
    ],
    onwarn: (warning) => {
      if (warning.code === 'THIS_IS_UNDEFINED') {
        return;
      }

      log.warn(warning.message);
    }
  });

  // Output the bundle to disk
  await bundle.write({
    // Keep the moduleId empty because we don't want to force developers to a specific moduleId.
    moduleId: '',
    name: `${opts.moduleName}`,
    file: opts.dest,
    format: opts.format,
    banner: '',
    globals: moduleId => umdModuleIdStrategy(moduleId, opts.umdModuleIds),
    sourcemap: true
  });
}
