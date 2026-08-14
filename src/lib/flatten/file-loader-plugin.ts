import { dirname, extname, isAbsolute, resolve } from 'node:path';
import type { Plugin } from 'rolldown';
import { OutputFileCache } from '../ng-package/nodes';

import * as log from '../utils/log';
import { ensureUnixPath } from '../utils/path';

/**
 * Loads a file and its map.
 */
export function fileLoaderPlugin(fileCache: OutputFileCache, resolutionExtensions: string[], dtsMode: boolean): Plugin {
  return {
    name: 'file-loader',
    resolveId: function (id, importer) {
      let resolved: string;
      if (importer) {
        if (id[0] !== '.' && id[0] !== '/' && !isAbsolute(id)) {
          return;
        }

        resolved = ensureUnixPath(resolve(dirname(importer), id));
      } else {
        resolved = ensureUnixPath(id);
      }

      if (fileCache.has(resolved)) {
        return resolved;
      }

      const ext = extname(resolved);
      const base = resolved.slice(0, -ext.length);
      if (dtsMode) {
        let potential: string | undefined;
        switch (ext) {
          case '.js':
          case '.ts':
            potential = `${base}.d.ts`;
            break;
          case '.mjs':
          case '.mts':
            potential = `${base}.d.mts`;
            break;
          case '.cjs':
          case '.cts':
            potential = `${base}.d.cts`;
            break;
        }

        if (potential && fileCache.has(potential)) {
          return potential;
        }
      } else {
        let potential: string | undefined;
        switch (ext) {
          case '.ts':
            potential = `${base}.js`;
            break;
          case '.mts':
            potential = `${base}.mjs`;
            break;
          case '.cts':
            potential = `${base}.cjs`;
            break;
        }

        if (potential && fileCache.has(potential)) {
          return potential;
        }
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
