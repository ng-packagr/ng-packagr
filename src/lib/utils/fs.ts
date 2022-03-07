import * as fs from 'fs';
import { dirname } from 'path';
import { promisify } from 'util';

export const readFile = fs.promises.readFile;
export const writeFile = fs.promises.writeFile;
export const access = fs.promises.access;
export const mkdir = fs.promises.mkdir;
export const stat = fs.promises.stat;
export const rmdir = fs.promises.rm;

export async function exists(path: fs.PathLike): Promise<boolean> {
  try {
    await access(path, fs.constants.F_OK);

    return true;
  } catch {
    return false;
  }
}

const cpFile = promisify(fs.copyFile);
export async function copyFile(src: string, dest: string): Promise<void> {
  const dir = dirname(dest);
  if (!(await exists(dir))) {
    await mkdir(dir, { recursive: true });
  }

  await cpFile(src, dest, fs.constants.COPYFILE_FICLONE);
}
