import { promisify } from 'util';
import * as rm from 'rimraf';
import * as fs from 'fs';
import { dirname } from 'path';

export const rimraf = promisify(rm);
export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);
export const access = promisify(fs.access);
export const mkdir = promisify(fs.mkdir);
export const lstat = promisify(fs.lstat);

export async function exists(path: fs.PathLike): Promise<boolean> {
  try {
    await access(path, fs.constants.F_OK);

    return true;
  } catch (error) {
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
