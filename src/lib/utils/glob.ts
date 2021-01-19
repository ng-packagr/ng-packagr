import * as glob from 'glob';
import { promisify } from 'util';
import { flatten, toArray } from './array';

const globPromise = promisify(glob);

export async function globFiles(pattern: string | string[], options?: glob.IOptions): Promise<string[]> {
  const files = await Promise.all<string[]>(toArray(pattern).map(p => globPromise(p, options)));

  return flatten(files);
}
