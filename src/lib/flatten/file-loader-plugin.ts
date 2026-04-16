import { dirname, format, parse, resolve } from 'node:path';
import type { Plugin } from 'rollup';
import { OutputFileCache } from '../ng-package/nodes';

import * as log from '../utils/log';
import { ensureUnixPath } from '../utils/path';

/**
 * Loads a file and it's map.
 */
export function fileLoaderPlugin(
  fileCache: OutputFileCache,
  resolutionExtension: string,
  resolutionExtensionMapping?: Record<string, string>
): Plugin {
  return {
    name: 'file-loader',
    resolveId: function (id, importer) {
      if (fileCache.has(ensureUnixPath(id))) {
        return id;
      }

      if (!importer) {
        return;
      }

      const importerDirectory = dirname(importer);
      const resolved = ensureUnixPath(resolve(importerDirectory, id));
      if (fileCache.has(resolved)) {
        return resolved;
      }

      const fileWithResolutionExtension = format({
        name: resolved,
        ext: resolutionExtension
      });
      if (fileCache.has(fileWithResolutionExtension)) {
        return fileWithResolutionExtension;
      }

      const indexFilePath = format({
        dir: resolved,
        name: 'index',
        ext: resolutionExtension
      });
      if (fileCache.has(indexFilePath)) {
        return indexFilePath;
      }

      const {
        ext
      } = parse(resolved);

      const mappedExtension = resolutionExtensionMapping?.[ext];

      if (mappedExtension) {
        const fileExtensionReplacedWithMappedExtension = format({
          ...parse(resolved),
          base: '',
          ext: mappedExtension
        });
        if (fileCache.has(fileExtensionReplacedWithMappedExtension)) {
          return fileExtensionReplacedWithMappedExtension;
        }
      }
    },
    load: function (id) {
      log.debug(`file-loader ${id}`);
      const idPosix = ensureUnixPath(id);
      const data = fileCache.get(idPosix);
      if (!data) {
        throw new Error(`Could not load '${id}' from memory.`);
      }

      return {
        code: data.content,
        map: fileCache.get(`${idPosix}.map`)?.content,
      };
    },
  };
}
