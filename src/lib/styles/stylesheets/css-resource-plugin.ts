import type { Plugin, PluginBuild } from 'esbuild';
import { readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { LoadResultCache, createCachedLoad } from '../load-result-cache';
import { CssUrl } from '../stylesheet-processor';

const CSS_RESOURCE_NAMESPACE = 'angular:css-resource';

/**
 * Symbol marker used to indicate CSS resource resolution is being attempted.
 * This is used to prevent an infinite loop within the plugin's resolve hook.
 */
const CSS_RESOURCE_RESOLUTION = Symbol('CSS_RESOURCE_RESOLUTION');

/**
 * Creates an esbuild {@link Plugin} that loads all CSS url token references using the
 * built-in esbuild `file` loader. A plugin is used to allow for all file extensions
 * and types to be supported without needing to manually specify all extensions
 * within the build configuration.
 *
 * @returns An esbuild {@link Plugin} instance.
 */
export function createCssResourcePlugin(url: CssUrl, cache?: LoadResultCache): Plugin {
  return {
    name: 'angular-css-resource',
    setup(build: PluginBuild): void {
      build.onResolve({ filter: /.*/ }, async args => {
        // Only attempt to resolve url tokens which only exist inside CSS.
        // Also, skip this plugin if already attempting to resolve the url-token.
        if (args.kind !== 'url-token' || args.pluginData?.[CSS_RESOURCE_RESOLUTION]) {
          return null;
        }

        // If root-relative, absolute or protocol relative url, mark as external to leave the
        // path/URL in place.
        if (url !== CssUrl.inline || /^((?:\w+:)?\/\/|data:|chrome:|#|\/)/.test(args.path)) {
          return {
            path: args.path,
            external: true,
          };
        }

        const { importer, kind, resolveDir, namespace, pluginData = {} } = args;
        pluginData[CSS_RESOURCE_RESOLUTION] = true;

        const result = await build.resolve(args.path, {
          importer,
          kind,
          namespace,
          pluginData,
          resolveDir,
        });

        if (result.errors.length) {
          const error = result.errors[0];
          if (args.path[0] === '~') {
            error.notes = [
              {
                location: null,
                text: 'You can remove the tilde and use a relative path to reference it, which should remove this error.',
              },
            ];
          } else if (args.path[0] === '^') {
            error.notes = [
              {
                location: null,
                text: 'You can remove the caret and use a relative path to reference it, which should remove this error.',
              },
            ];
          }

          const extension = importer && extname(importer);
          if (extension !== '.css') {
            error.notes.push({
              location: null,
              text: 'Preprocessor stylesheets may not show the exact file location of the error.',
            });
          }
        }

        // Return results that are not files since these are most likely specific to another plugin
        // and cannot be loaded by this plugin.
        if (result.namespace !== 'file') {
          return result;
        }

        // All file results are considered CSS resources and will be loaded via the file loader
        return {
          ...result,
          // Use a relative path to prevent fully resolved paths in the metafile (JSON stats file).
          // This is only necessary for custom namespaces. esbuild will handle the file namespace.
          path: relative(build.initialOptions.absWorkingDir ?? '', result.path),
          namespace: CSS_RESOURCE_NAMESPACE,
        };
      });

      build.onLoad(
        { filter: /./, namespace: CSS_RESOURCE_NAMESPACE },
        createCachedLoad(cache, async args => {
          const resourcePath = join(build.initialOptions.absWorkingDir ?? '', args.path);

          return {
            contents: await readFile(resourcePath),
            loader: 'dataurl',
            watchFiles: [resourcePath],
          };
        }),
      );
    },
  };
}
