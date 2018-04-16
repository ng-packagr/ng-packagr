import * as path from 'path';
import { DestinationFiles } from '../ng-package-format/shared';

/**
 * Get an array of globs and file paths for JS or JS Map files for this entry point.
 */
export function getGlobForMapWork(destinationFiles: DestinationFiles, shouldAppendMapExtention = false): string[] {
  return Object.keys(destinationFiles)
    .map((key: keyof DestinationFiles) => {
      // we need to modify this as we need the glob for all the files in esm5 and esm2015 directory
      const file = destinationFiles[key];
      if (key === 'esm5' || key === 'esm2015') {
        return `${path.dirname(file)}/**/*.js`;
      }

      return file;
    })
    .filter(x => x.endsWith('.js'))
    .map(x => (shouldAppendMapExtention ? `${x}.map` : x));
}
