import { dirname, resolve } from 'node:path';
import type { Plugin } from 'rollup';
import { OutputFileCache } from '../ng-package/nodes';

import * as log from '../utils/log';
import { ensureUnixPath } from '../utils/path';

const POTENTIAL_MATCHES = ['', '.mjs', '/index.mjs'];
/**
 * Loads a file and it's map.
 */
export function fileLoaderPlugin(fileCache: OutputFileCache): Plugin {
  return {
    name: 'file-loader',
    resolveId: function (id, importer) {
      if (fileCache.has(ensureUnixPath(id))) {
        return id;
      }

      if (importer) {
        const resolved = ensureUnixPath(resolve(dirname(importer), id));
        for (const suffix of POTENTIAL_MATCHES) {
          const potential = resolved + suffix;
          if (fileCache.has(potential)) {
            return potential;
          }
        }
      }
    },
    load: function (id) {
      log.debug(`file-loader ${id}`);
      const data = fileCache.get(ensureUnixPath(id));
      if (!data) {
        throw new Error(`Could not load '${id}' from memory.`);
      }

      return {
        code: data.content,
        map: data.map,
      };
    },
  };
}
