import * as fs from 'fs-extra';
import { debug } from './log';
import { toArray } from './array';

export async function copyFiles(src: string | string[], dest: string): Promise<void> {
  const files = toArray(src);
  for (let file of files) {
    const doesExist = await fs.pathExists(file);
    if (doesExist) {
      debug(`copyFiles from ${src} to ${dest}`);
      await fs.copy(file, dest);
    }
  }
}
