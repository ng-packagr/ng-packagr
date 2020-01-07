import { copy, CopyOptions, pathExists } from 'fs-extra';

export async function copyFile(src: string, dest: string, options?: CopyOptions): Promise<void> {
  const exists = await pathExists(src);

  return exists ? copy(src, dest, options) : undefined;
}
