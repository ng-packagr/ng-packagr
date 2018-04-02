import * as sorcery from 'sorcery';
import * as log from '../util/log';
import { globFiles } from '../util/glob';

/**
 * Re-maps the source `.map` file for the given `sourceFile` or `Glob Pattern`. This keeps source maps intact over
 * a series of transpilations!
 *
 * @param globPattern Source file or Glob pattern
 */
export async function remapSourceMap(globPattern: string | string[]): Promise<any> {
  // read and create chains
  const filesPath = await globFiles(globPattern);

  const chains = await Promise.all(
    filesPath.map(sourceFile => {
      log.debug(`re-mapping sources for ${sourceFile}`);
      return sorcery.load(sourceFile);
    })
  );

  // write re-mapped sourcemaps
  const opts = {
    inline: false,
    includeContent: true
  };

  return Promise.all(chains.map(x => x.write(opts)));
}
