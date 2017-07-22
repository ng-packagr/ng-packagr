const fs = require('mz/fs');
const path = require('path');
const vfs = require('vinyl-fs');

const inlineNg2Template =  require('gulp-inline-ng2-template');

const autoprefixer = require('autoprefixer');
const browserslist = require('browserslist');
//const postcss      = require('postcss');
import postcss = require('postcss');
const sass         = require('node-sass');

import { debug, warn } from '../util/log';


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

    vfs.src([`${src}/**/*.ts`, '!node_modules/**/*'])
      .pipe(inlineNg2Template({
        base: `${src}`,
        useRelativePaths: true,
        styleProcessor: (path, ext, file, cb) => {

          debug(`render stylesheet ${path}`);
          const render = pickRenderer(path, ext, file);

          debug(`postcss with autoprefixer for ${path}`);
          const browsers = browserslist(undefined, { path });

          render
            .then((css: string) => {
              return postcss([ autoprefixer({ browsers }) ])
                .process(css, { from: path, to: path.replace(ext, '.css') });
            })
            .then((result: postcss.Result) => {

              result.warnings().forEach((msg) => {
                warn(msg.toString());
              });

              cb(undefined, result.css);
            })
            .catch((err) => {
              cb(err || new Error(`Cannot inline stylesheet ${path}`));
            });

        }
      }))
      .on('error', reject)
      .pipe(vfs.dest(`${dest}`))
      .on('end', resolve);
  });

}


const sassImporter = (url: string): any => {
  if (url[0] === '~') {
    url = path.resolve('node_modules', url.substr(1));
  }

  return { file: url };
}


const pickRenderer = (filePath: string, ext: string[], file: string): Promise<string> => {

  switch (path.extname(filePath)) {

    case '.scss':
    case '.sass':
      debug(`rendering sass for ${filePath}`);
      return renderSass({ file: filePath, importer: sassImporter });

    case '.css':
    default:
      return Promise.resolve(file);
  }

}


const renderSass = (sassOpts: any): Promise<string> => {

  return new Promise((resolve, reject) => {

    sass.render(sassOpts, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.css.toString());
      }
    });
  });
}
