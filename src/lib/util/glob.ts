import * as glob from 'glob';
import { promisify } from './promisify';
import { flatten, toArray } from './array';

export async function globFiles(pattern: string | string[], options?: glob.IOptions): Promise<string[]> {
  const globPromise = pattern => promisify<string[]>(resolveOrReject => glob(pattern, options, resolveOrReject));
  const files = await Promise.all(toArray(pattern).map(globPromise));
  return flatten(files);
}
