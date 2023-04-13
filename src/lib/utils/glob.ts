import glob, { Options } from 'fast-glob';
import { toArray } from './array';

export async function globFiles(pattern: string | string[], options?: Options): Promise<string[]> {
  const files = await Promise.all(toArray(pattern).map(p => glob(p, options)));

  return files.flatMap(x => x);
}
