import * as tar from 'tar';
import * as log from './log';

/**
 * Creates a tgz file with the directory contents.
 */
export function createTarball(file: string, dir: string) {
  log.info('Creating tarball archive (.tgz)');

  return tar.create(
    {
      gzip: true,
      strict: true,
      portable: true,
      cwd: dir,
      file: file,
      sync: true
    },
    ['.']
  );
}
