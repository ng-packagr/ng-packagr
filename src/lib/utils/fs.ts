import { PathLike, constants } from 'node:fs';
import { access, copyFile as cpFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

export { readFile, writeFile, access, mkdir, stat, rm as rmdir } from 'node:fs/promises';

export async function exists(path: PathLike): Promise<boolean> {
  try {
    await access(path, constants.F_OK);

    return true;
  } catch {
    return false;
  }
}

export async function copyFile(src: string, dest: string): Promise<void> {
  const dir = dirname(dest);
  if (!(await exists(dir))) {
    await mkdir(dir, { recursive: true });
  }

  await cpFile(src, dest, constants.COPYFILE_FICLONE);
}
