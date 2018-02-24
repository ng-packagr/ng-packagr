import * as fs from 'fs-extra';
import * as path from 'path';
import stripBom = require('strip-bom');
import { Transform, transformFromPromise } from '../../../brocc/transform';
import { NgEntryPoint, CssUrl } from '../../../ng-package-format/entry-point';
import * as log from '../../../util/log';
import { isEntryPointInProgress, fileUrlPath } from '../../nodes';

// CSS Tools
import * as autoprefixer from 'autoprefixer';
import * as browserslist from 'browserslist';
import * as postcss from 'postcss';
import * as sass from 'node-sass';
import * as nodeSassTildeImporter from 'node-sass-tilde-importer';
import * as less from 'less';
import * as stylus from 'stylus';
import * as postcssUrl from 'postcss-url';
import * as postCssClean from 'postcss-clean';

export const stylesheetTransform: Transform = transformFromPromise(async graph => {
  log.info(`Rendering Stylesheets`);

  // TODO: fetch current entry point from graph
  const entryPoint = graph.find(isEntryPointInProgress());

  // TODO: fetch nodes from the graph
  const stylesheetNodes = graph.from(entryPoint).filter(node => node.type === 'text/css' && node.state !== 'done');

  // TODO: detemrine base path from NgPackage
  const ngPkg = graph.find(node => node.type === 'application/ng-package');
  const basePath: string = ngPkg.data.basePath;

  await Promise.all(
    stylesheetNodes.map(async stylesheetNode => {
      const filePath: string = fileUrlPath(stylesheetNode.url);

      // preprocessor (render)
      const renderedCss: string = await renderPreProcessor(filePath, basePath, entryPoint.data.entryPoint);

      // postcss (autoprefixing, et al)
      const result: string = await renderPostCss(filePath, renderedCss, entryPoint.data.entryPoint.cssUrl);

      // TODO: update nodes in the graph
      stylesheetNode.data = {
        ...stylesheetNode.data,
        content: result
      };
    })
  );

  // TODO: await forEach() ?!?

  return graph;
});

async function renderPostCss(filePath: string, cssStyles: string, cssUrl: CssUrl): Promise<string> {
  log.debug(`determine browserslist for ${filePath}`);
  const browsers = browserslist(undefined, { filePath });

  const postCssPlugins = [];

  if (cssUrl !== CssUrl.none) {
    log.debug(`postcssUrl: ${cssUrl}`);
    postCssPlugins.push(postcssUrl({ url: cssUrl }));
  }

  // this is important to be executed post running `postcssUrl`
  postCssPlugins.push(
    autoprefixer({ browsers }),
    postCssClean({
      level: {
        2: {
          specialComments: false
        }
      }
    })
  );

  const result: postcss.Result = await postcss(postCssPlugins).process(cssStyles, {
    from: filePath,
    to: filePath.replace(path.extname(filePath), '.css')
  });

  // Escape existing backslashes for the final output into a string literal, which would otherwise escape the character after it
  result.css = result.css.replace(/\\/g, '\\\\');

  // Log warnings from postcss
  result.warnings().forEach(msg => {
    log.warn(msg.toString());
  });

  return result.css;
}

async function renderPreProcessor(filePath: string, basePath: string, entryPoint: NgEntryPoint): Promise<string> {
  log.debug(`Render styles for ${filePath}`);
  switch (path.extname(filePath)) {
    case '.scss':
    case '.sass':
      log.debug(`rendering sass from ${filePath}`);
      return renderSass({
        file: filePath,
        importer: nodeSassTildeImporter,
        includePaths: entryPoint.styleIncludePaths
      });

    case '.less':
      log.debug(`rendering less from ${filePath}`);
      return renderLess({
        filename: filePath,
        paths: entryPoint.styleIncludePaths
      });

    case '.styl':
    case '.stylus':
      log.debug(`rendering styl from ${filePath}`);
      return renderStylus({
        filename: filePath,
        root: basePath,
        paths: entryPoint.styleIncludePaths
      });

    case '.css':
    default:
      log.debug(`reading css from ${filePath}`);
      return fs.readFile(filePath).then(buffer => stripBom(buffer.toString()));
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
};

const renderLess = (lessOpts: any): Promise<string> => {
  return fs
    .readFile(lessOpts.filename)
    .then(buffer => stripBom(buffer.toString()))
    .then(
      (lessData: string) =>
        new Promise<string>((resolve, reject) => {
          less.render(lessData || '', lessOpts, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result.css.toString());
            }
          });
        })
    );
};

/**
 * filename - absolute path to file
 * root - root folder of project (where ng-package.json is located)
 */
const renderStylus = ({ filename, root, paths }): Promise<string> => {
  return fs
    .readFile(filename)
    .then(buffer => stripBom(buffer.toString()))
    .then(
      (stylusData: string) =>
        new Promise<string>((resolve, reject) => {
          stylus(stylusData)
            // add paths for resolve
            .set('paths', [root, '.', ...paths, 'node_modules'])
            // add support for resolving plugins from node_modules
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
        })
    );
};
