import * as sorcery from 'sorcery';
import { Artefacts } from '../domain/build-artefacts';
import { NgEntryPoint, NgPackage } from '../domain/ng-package-format';
import { modifyJsonFiles } from '../util/json';
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


/**
 * Relocates pathes of the `sources` file array in `*.js.map` files.
 *
 * Simply said, because `sourcesContent` are inlined in the source maps, it's possible to pass an
 * arbitrary file name and path in the `sources` property. By setting the value to a common prefix,
 * i.e. `ng://@org/package/secondary`,
 * the source map p `.map` file's relative root file paths to the module's name.
 *
 * @param pkg Angular package
 */
export async function relocateSourceMapSources(
  { artefacts, entryPoint }: { artefacts: Artefacts, entryPoint: NgEntryPoint }): Promise<void> {

  await modifyJsonFiles(`${artefacts.stageDir}/+(bundles|esm2015|esm5)/**/*.js.map`,
    (sourceMap: any): any => {
      sourceMap.sources = (sourceMap.sources as string[])
        .map((path) => {
          let trimmedPath = path;
          // Trim leading '../' path separators
          while (trimmedPath.startsWith('../')) {
            trimmedPath = trimmedPath.substring(3);
          }

          return `ng://${entryPoint.moduleId}/${trimmedPath}`;
        });

      return sourceMap;
    }
  );
}
