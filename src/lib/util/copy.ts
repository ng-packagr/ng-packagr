import { copy } from 'cpx';
import { promisify } from './promisify';
import { debug } from './log';

export const copyFiles = (src: string, dest: string, options?: any): Promise<void> => {
  debug('copyFiles from ' + src + ' to ' + dest);
  return promisify<void>((resolveOrReject) => {
    if (options) {
      copy(src, dest, options, resolveOrReject);
    } else {
      copy(src, dest, resolveOrReject);
    }
  });

};
