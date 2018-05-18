import * as path from 'path';
import { Transform, transformFromPromise } from '../../../brocc/transform';
import { NgEntryPoint } from '../../../ng-package-format/entry-point';
import * as log from '../../../util/log';
import { CssUrl } from '../../../ng-package-format/shared';
import { CacheEntry } from '../../../file/file-cache';
import { isEntryPointInProgress, isPackage, EntryPointNode } from '../../nodes';

// CSS Tools
import * as autoprefixer from 'autoprefixer';
import * as browserslist from 'browserslist';
import * as sass from 'node-sass';
import * as nodeSassTildeImporter from 'node-sass-tilde-importer';
import * as postcss from 'postcss';
import * as postcssUrl from 'postcss-url';
import * as postcssClean from 'postcss-clean';
import * as less from 'less';
import * as stylus from 'stylus';

const STYLESHEET_REGEXP = /.*.(sass|scss|less|css|stylus|styl)$/;

export const stylesheetTransform: Transform = transformFromPromise(async graph => {
  log.info(`Rendering Stylesheets`);

  // Fetch current entry point from graph
  const entryPoint = graph.find(isEntryPointInProgress()) as EntryPointNode;

  const { resourcesFileCache } = entryPoint.cache;
  // Fetch stylesheet nodes from the graph
  const stylesheetPaths: string[] = [];

  resourcesFileCache.forEach((value, fileName) => {
    if (!value.processedContent && STYLESHEET_REGEXP.test(fileName)) {
      stylesheetPaths.push(fileName);
    }
  });

  // Determine base path from NgPackage
  const ngPkg = graph.find(isPackage);
  const postCssProcessor = createPostCssProcessor(ngPkg.data.basePath, entryPoint.data.entryPoint.cssUrl);

  for (let filePath of stylesheetPaths) {
    const cachedData = resourcesFileCache.get(filePath);
    // Render pre-processor language (sass, styl, less)
    const renderedCss: string = await renderPreProcessor(
      filePath,
      cachedData.content,
      ngPkg.data.basePath,
      entryPoint.data.entryPoint
    );

    // Render postcss (autoprefixing and friends)
    const result = await postCssProcessor.process(renderedCss, {
      from: filePath,
      to: filePath.replace(path.extname(filePath), '.css')
    });

    // Log warnings from postcss
    result.warnings().forEach(msg => {
      log.warn(msg.toString());
    });

    // Update node in the graph
    cachedData.processedContent = result.css;
  }

  return graph;
});

function createPostCssProcessor(basePath: string, cssUrl: CssUrl): postcss.Processor {
  log.debug(`determine browserslist for ${basePath}`);
  const browsers = browserslist(undefined, { filePath: basePath });

  const postCssPlugins = [];

  if (cssUrl !== CssUrl.none) {
    log.debug(`postcssUrl: ${cssUrl}`);
    postCssPlugins.push(postcssUrl({ url: cssUrl }));
  }

  // this is important to be executed post running `postcssUrl`
  postCssPlugins.push(
    autoprefixer({ browsers }),
    postcssClean({
      level: {
        2: {
          specialComments: false
        }
      }
    })
  );

  return postcss(postCssPlugins);
}

async function renderPreProcessor(
  filePath: string,
  data: string,
  basePath: string,
  entryPoint: NgEntryPoint
): Promise<string> {
  log.debug(`Render styles for ${filePath}`);
  switch (path.extname(filePath)) {
    case '.scss':
    case '.sass':
      log.debug(`rendering sass from ${filePath}`);
      return renderSass({
        file: '-', // this is to avoid exception returned value of `file` must be a string
        data,
        importer: nodeSassTildeImporter,
        includePaths: entryPoint.styleIncludePaths
      });

    case '.less':
      log.debug(`rendering less from ${filePath}`);
      return renderLess({
        data,
        paths: entryPoint.styleIncludePaths
      });

    case '.styl':
    case '.stylus':
      log.debug(`rendering styl from ${filePath}`);
      return renderStylus({
        filename: filePath,
        data,
        root: basePath,
        paths: entryPoint.styleIncludePaths
      });

    case '.css':
    default:
      log.debug(`reading css from ${filePath}`);
      return data;
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
  return new Promise<string>((resolve, reject) => {
    less.render(lessOpts.data || '', lessOpts, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.css.toString());
      }
    });
  });
};

/**
 * filename - absolute path to file
 * root - root folder of project (where ng-package.json is located)
 */
const renderStylus = ({ filename, data, root, paths }): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    stylus(data)
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
  });
};
