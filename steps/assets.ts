const inlineNg2Template =  require('gulp-inline-ng2-template');
const sass = require('node-sass');
const vfs = require('vinyl-fs');

import { debug } from '../util/log';


/**
 * Process Angular components assets (HTML and Stylesheets).
 *
 * Inlines 'templateUrl' and 'styleUrl', compiles .scss to .css, and write .ts files to
 * destination directory.
 *
 * @param src Source folder
 * @param dest Destination folder
 */
export const processAssets = (src: string, dest: string): Promise<any> => {

  return new Promise((resolve, reject) => {
    debug(`processAssets ${src} to ${dest}`);

    vfs.src(`${src}/**/*.ts`)
      .pipe(inlineNg2Template({
        base: `${src}`,
        useRelativePaths: true,
        styleProcessor: (path, ext, file, cb) => {

          debug(`sass.render ${path}`);

          sass.render({
            file: path
          }, (err, result) => {
            if (err) {
              cb(err);
            } else {
              cb(null, result.css.toString());
            }
          });
        }
      }))
      .on('error', reject)
      .pipe(vfs.dest(`${dest}`))
      .on('end', resolve);
  });

}
