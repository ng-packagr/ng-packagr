import * as path from 'path';
import { readFile } from 'fs-extra';
import { NgArtefacts } from '../ng-package-format/artefacts';
import { NgPackage } from '../ng-package-format/package';
import { CssUrl, NgEntryPoint } from '../ng-package-format/entry-point';
import { BuildStep } from '../deprecations';
import * as log from '../util/log';

// CSS Tools
import * as autoprefixer from 'autoprefixer';
import * as browserslist from 'browserslist';
import * as postcss from 'postcss';
import * as sass from 'node-sass';
import * as nodeSassTildeImporter from 'node-sass-tilde-importer';
import * as less from 'less';
import * as stylus from 'stylus';
import * as postcssUrl from 'postcss-url';
import * as postcssComments from 'postcss-discard-comments';

export const processAssets: BuildStep =
  async ({ artefacts, entryPoint, pkg }): Promise<NgArtefacts> => {
    // process templates
    const templates = await Promise.all(
      artefacts.templates()
        .map(async (template) => {
          return {
            name: template,
            content: await processTemplate(template)
          };
        })
    );
    templates.forEach((template) => {
      artefacts.template(template.name, template.content);
    });

    // process stylesheets
    const stylesheets = await Promise.all(
      artefacts.stylesheets()
        .map(async (stylesheet) => {
          return {
            name: stylesheet,
            content: await processStylesheet(stylesheet, pkg.src, entryPoint)
          };
        })
    );
    stylesheets.forEach((stylesheet) => {
      artefacts.stylesheet(stylesheet.name, stylesheet.content);
    });

    return Promise.resolve(artefacts);
  }

/**
 * Process a component's template.
 *
 * @param templateFilePath Path of the HTML templatefile, e.g. `/Users/foo/Project/bar/bar.component.html`
 * @return Resolved content of HTML template file
 */
const processTemplate =
  (templateFilePath: string): Promise<string> =>
    readFile(templateFilePath).then((buffer) => buffer.toString());

/**
 * Process a component's stylesheet file. Each stylesheet will be processed individually.
 *
 * @param stylesheetFilePath Path of the stylesheet, e.g. '/Users/foo/Project/bar/bar.component.scss'
 * @param srcFolder Source folder from 'ng-package.json'
 * @param entryPoint the entrypoint of the stylesheet being processed
 *
 * @return Rendered CSS content of stylesheet file
 */
const processStylesheet =
  async (stylesheetFilePath: string, srcFolder: string, entryPoint: NgEntryPoint): Promise<string> => {

    try {
      const cssUrl = entryPoint.cssUrl;

      log.debug(`Render styles for ${stylesheetFilePath}`);
      const cssStyles: string = await renderPreProcessor(stylesheetFilePath, srcFolder, entryPoint);

      log.debug(`determine browserslist for ${stylesheetFilePath}`);
      const browsers = browserslist(undefined, { stylesheetFilePath });

      log.debug(`postcss with autoprefixer for ${stylesheetFilePath}`);
      const postCssPlugins = [
        autoprefixer({ browsers }),
        postcssComments({ removeAll: true })
      ];

      if (cssUrl !== CssUrl.none) {
        log.debug(`postcssUrl: ${cssUrl}`);
        postCssPlugins.push(postcssUrl({ url: cssUrl }));
      }

      const result: postcss.Result = await postcss(postCssPlugins)
        .process(cssStyles, {
          from: stylesheetFilePath,
          to: stylesheetFilePath.replace(path.extname(stylesheetFilePath), '.css')
        });

      // Escape existing backslashes for the final output into a string literal, which would otherwise escape the character after it
      result.css = result.css.replace(/\\/g, '\\\\');

      // Log warnings from postcss
      result.warnings().forEach((msg) => {
        log.warn(msg.toString());
      });

      return Promise.resolve(result.css);
    } catch (err) {
      return Promise.reject(new Error(`Cannot inline stylesheet ${stylesheetFilePath}`));
    }

  }


async function renderPreProcessor(filePath: string, srcPath: string, entryPoint: NgEntryPoint): Promise<string> {

  switch (path.extname(filePath)) {

    case '.scss':
    case '.sass':
      log.debug(`rendering sass from ${filePath}`);
      return await renderSass({ file: filePath, importer: nodeSassTildeImporter, includePaths: entryPoint.sassIncludePaths });

    case '.less':
      log.debug(`rendering less from ${filePath}`);
      return await renderLess({ filename: filePath });

    case '.styl':
    case '.stylus':
      log.debug(`rendering styl from ${filePath}`);
      return await renderStylus({ filename: filePath, root: srcPath });

    case '.css':
    default:
      log.debug(`reading css from ${filePath}`);
      return readFile(filePath).then((buffer) => buffer.toString());
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
    .then(buffer => buffer.toString())
    .then((lessData: string) => new Promise<string>((resolve, reject) => {
      less.render(lessData || '', lessOpts, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.css.toString());
        }
      })
    }));
}

/**
 * filename - absolute path to file
 * root - root folder of project (where ng-package.json is located)
 */
const renderStylus = ({ filename, root }): Promise<string> => {
  return readFile(filename)
    .then(buffer => buffer.toString())
    .then((stylusData: string) => new Promise<string>((resolve, reject) => {
      stylus(stylusData)
        // add paths for resolve
        .include(root)
        .include('.')
        // add support for resolving plugins from node_modules
        .include('node_modules')
        .set('filename', filename)
        // turn on url resolver in stylus, same as flag --resolve-url
        .set('resolve url', true)
        .define('url', stylus.resolver())
        .render((err, css) => {
          if (err) {
            reject(err);
          } else {
            resolve(css);
          }
        });
    }));
}
