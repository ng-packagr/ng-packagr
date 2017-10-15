import { promisify } from './promisify';
import { debug } from './log';
const cpx = require('cpx');

export const copyFiles = (src: string, dest: string, options?: any): Promise<void> => {
  debug('copyFiles from ' + src + ' to ' + dest);
  return promisify<void>((resolveOrReject) => {
    if (options) {
      cpx.copy(src, dest, options, resolveOrReject);
    } else {
      cpx.copy(src, dest, resolveOrReject);
    }
  });

};
