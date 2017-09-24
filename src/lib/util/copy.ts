import { promisify } from './promisify';
const cpx = require('cpx');

export const copyFiles = (src: string, dest: string, options?: any): Promise<void> => {

  return promisify<void>((resolveOrReject) => {
    if (options) {
      cpx.copy(src, dest, options, resolveOrReject);
    } else {
      cpx.copy(src, dest, resolveOrReject);
    }
  });

};
