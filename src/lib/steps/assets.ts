const vfs = require('vinyl-fs');
import * as path from 'path';
import { debug, warn } from '../util/log';
import { readFile } from '../util/fs';

// Angular Inliner for Templates and Stylesheets
const inlineNg2Template =  require('gulp-inline-ng2-template');

// CSS Tools
const autoprefixer = require('autoprefixer');
const browserslist = require('browserslist');
//const postcss      = require('postcss');
import postcss     = require('postcss');
const sass         = require('node-sass');
import * as less from 'less';
import * as stylus from 'stylus';


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
          const render = pickRenderer(path, ext, file, src);

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


const pickRenderer = (filePath: string, ext: string[], file: string, ctx?: string): Promise<string> => {

  switch (path.extname(filePath)) {

    case '.scss':
    case '.sass':
      debug(`rendering sass for ${filePath}`);
      return renderSass({ file: filePath, importer: sassImporter });

    case '.less':
      debug(`rendering less for ${filePath}`);
      return renderLess({ filename: filePath });

    case '.styl':
    case '.stylus':
      debug(`rendering styl for ${filePath}`);
      return renderStylus({ filename: filePath, ctx });

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

const renderLess = (lessOpts: any): Promise<string> => {

  return readFile(lessOpts.filename)
    .then((lessData: string) => new Promise<string>((resolve, reject) => {
        less.render(lessData, lessOpts, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.css.toString());
        }
      })
    }));
}

const renderStylus = (stylusOpts: any): Promise<string> => {
  return readFile(stylusOpts.filename)
    .then((stylusData: string) => new Promise<string>((resolve, reject) => {
      stylus(stylusData)
        .include(stylusOpts.ctx)
        .render(function(err, css) {
          if (err) {
            reject(err);
          } else {
            resolve(css);
          }
        });
      }));
}
