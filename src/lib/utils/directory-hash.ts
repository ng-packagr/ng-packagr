import { Hash, createHash } from 'crypto';
import { join } from 'path';
import { readFile, readdir, stat } from './fs';

export async function directoryHash(root: string): Promise<string> {
  const hash = createHash('sha1').update(root);
  await hashDirectoryContents(root, hash);

  return hash.digest('hex');
}

async function hashDirectoryContents(root: string, hash: Hash): Promise<void> {
  const parts = await readdir(root);
  for (const part of parts) {
    const path = join(root, part);
    const stats = await stat(path);
    if (stats.isDirectory()) {
      await hashDirectoryContents(path, hash);
    } else if (stats.isFile()) {
      hash.update(await readFile(path));
    }
  }
}
