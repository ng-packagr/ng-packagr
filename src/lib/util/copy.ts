import { copy, AsyncOptions } from 'cpx';
import { promisify } from './promisify';
import { debug } from './log';
import { toArray } from './array';

export async function copyFiles(src: string | string[], dest: string, options?: AsyncOptions): Promise<void[]> {
  const promises = toArray(src).map(src => {
    debug(`copyFiles from ${src} to ${dest}`);
    return promisify<void>(resolveOrReject => {
      if (options) {
        copy(src, dest, options, resolveOrReject);
      } else {
        copy(src, dest, resolveOrReject);
      }
    });
  });

  return Promise.all(promises);
}
