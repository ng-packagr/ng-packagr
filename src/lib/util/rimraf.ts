const rm = require('rimraf');
import { promisify } from './promisify';
import { debug } from './log';

export const rimraf = (f: any, opts?: any) => {
  debug(`rimraf ${f}`);

  return promisify<void>((resolveOrReject) => {
    if (opts) {
      rm(f, opts, resolveOrReject);
    } else {
      rm(f, resolveOrReject);
    }
  });

};
