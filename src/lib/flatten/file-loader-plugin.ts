import { Plugin } from 'rollup';
import { OutputFileCache } from '../ng-package/nodes';

import * as log from '../utils/log';
import { ensureUnixPath } from '../utils/path';

/**
 * Loads a file and it's map.
 */
export function fileLoaderPlugin(fileCache: OutputFileCache): Plugin {
  return {
    name: 'file-loader',
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
