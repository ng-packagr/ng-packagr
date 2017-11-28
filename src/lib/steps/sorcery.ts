import * as sorcery from 'sorcery';
import { NgPackageData } from './../model/ng-package-data';
import { modifyJsonFiles } from './../util/json';
import { debug } from '../util/log';

/**
 * Re-maps the source `.map` file for the given `sourceFile`. This keeps source maps intact over
 * a series of transpilations!
 *
 * @param sourceFile Source file
 */
export async function remapSourceMap(sourceFile: string): Promise<void> {
  debug(`re-mapping sources for ${sourceFile}`);
  const opts: any = {
    inline: false,
    includeContent: true,
  };

  // Once sorcery loads the chain of sourcemaps, the new sourcemap will be written asynchronously.
  const chain = await sorcery.load(sourceFile);
  if (!chain) {
    throw new Error('Failed to load sourceMap chain for ' + sourceFile);
  }

  await chain.write(opts);
}
