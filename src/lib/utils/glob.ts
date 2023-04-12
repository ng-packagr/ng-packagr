import { GlobOptions, glob } from 'glob';
import { toArray } from './array';

export async function globFiles(pattern: string | string[], options?: GlobOptions): Promise<string[]> {
  const files = await Promise.all(toArray(pattern).map(p => glob(p, options)));

  return files.flatMap(x => x as string[]);
}
