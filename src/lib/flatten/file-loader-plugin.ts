import { dirname, resolve } from 'node:path';
import type { Plugin } from 'rollup';
import { OutputFileCache } from '../ng-package/nodes';

import * as log from '../utils/log';
import { ensureUnixPath } from '../utils/path';

/**
 * A regex used to strip the file extension from a file path.
 */
const FILE_EXT_REGEXP = /\.(c|m)?(t|j)s$/;

/**
 * Loads a file and it's map.
 */
export function fileLoaderPlugin(fileCache: OutputFileCache, resolutionExtensions: string[], dtsMode: boolean): Plugin {
  return {
    name: 'file-loader',
    resolveId: function (id, importer) {
      const normalizedId = ensureUnixPath(id);
      if (fileCache.has(normalizedId)) {
        return normalizedId;
      }

      const potentialId = normalizedId.endsWith('.d.ts')
        ? normalizedId
        : normalizedId.replace(FILE_EXT_REGEXP, (_match, p1) => {
            if (dtsMode) {
              return p1 ? `.d.${p1}ts` : '.d.ts';
            }

            return p1 ? `.${p1}js` : '.js';
          });

      if (fileCache.has(potentialId)) {
        return potentialId;
      }

      if (!importer) {
        return;
      }

      const resolved = ensureUnixPath(resolve(dirname(importer), potentialId));
      if (fileCache.has(resolved)) {
        return resolved;
      }

      for (const suffix of resolutionExtensions) {
        const potential = resolved + suffix;
        if (fileCache.has(potential)) {
          return potential;
        }
      }
    },
    load: function (id) {
      log.debug(`file-loader ${id}`);
      const data = fileCache.get(id);
      if (!data) {
        throw new Error(`Could not load '${id}' from memory.`);
      }

      return {
        code: data.content,
        map: fileCache.get(`${id}.map`)?.content,
      };
    },
  };
}
