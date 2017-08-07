const rm = require('rimraf');
import { debug } from '../util/log';

export const rimraf = (f: any, opts?: any) => {

  return new Promise((resolve, reject) => {
    debug(`rimraf ${f}`);

    if (opts) {
      rm(f, opts, (err) => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    } else {
      rm(f, (err) => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    }

  });

}
