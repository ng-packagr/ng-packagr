import { resolve as resolveSourceMap } from 'source-map-resolve';
import * as fs from 'fs-extra';
import { promisify } from '../util/promisify';

export function sourcemaps() {
  return {
    name: 'sourcemaps',

    async load(id) {
      let code;

      try {
        code = await fs.readFile(id, 'utf8');
      } catch {
        return null;
      }

      try {
        const sourceMap = await promisify<any>(resolveOrReject =>
          resolveSourceMap(code, id, fs.readFile, resolveOrReject)
        );
        const { sourcesContent, map } = sourceMap;
        map.sourcesContent = sourcesContent;
        return { code, map };
      } catch {
        return code;
      }
    }
  };
}
