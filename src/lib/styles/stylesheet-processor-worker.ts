import * as path from 'path';
import * as autoprefixer from 'autoprefixer';
import * as nodeSassTildeImporter from 'node-sass-tilde-importer';
import postcss, { LazyResult } from 'postcss';
import * as postcssUrl from 'postcss-url';
import * as cssnano from 'cssnano';

import { CssUrl, WorkerOptions, WorkerResult } from './stylesheet-processor';
import { readFile } from '../utils/fs';

async function processCss({ filePath, browserslistData, cssUrl, styleIncludePaths, basePath }: WorkerOptions): Promise<WorkerResult> {
  // Render pre-processor language (sass, styl, less)
  const renderedCss = await renderCss(filePath, basePath, styleIncludePaths);

  // Render postcss (autoprefixing and friends)
  const result = await optimizeCss(filePath, renderedCss, browserslistData, cssUrl);

  return {
    css: result.css,
    warnings: result.warnings().map(w => w.toString()),
  };
}

async function renderCss(filePath: string, basePath, styleIncludePaths?: string[]): Promise<string> {
  const ext = path.extname(filePath);
  const content = await readFile(filePath, 'utf8');

  switch (ext) {
    case '.sass':
    case '.scss': {
      /*
       * Please be aware of the few differences in behaviour https://github.com/sass/dart-sass/blob/master/README.md#behavioral-differences-from-ruby-sass
       * By default `npm install` will install sass.
       * To use node-sass you need to use:
       *   Npm:
       *     `npm install node-sass --save-dev`
       *   Yarn:
       *     `yarn add node-sass --dev`
       */
      let sassCompiler: any | undefined;
      try {
        sassCompiler = require('node-sass'); // Check if node-sass is explicitly included.
      } catch {
        sassCompiler = await import('sass');
      }

      return sassCompiler
        .renderSync({
          file: filePath,
          data: content,
          indentedSyntax: '.sass' === ext,
          importer: nodeSassTildeImporter,
          includePaths: styleIncludePaths,
        })
        .css.toString();
    }
    case '.less': {
      const { css } = await (await import('less')).render(content, {
        filename: filePath,
        javascriptEnabled: true,
        paths: styleIncludePaths,
      });

      return css;
    }
    case '.styl':
    case '.stylus': {
      const stylus = await import('stylus');

      return (
        stylus(content)
          // add paths for resolve
          .set('paths', [basePath, '.', ...styleIncludePaths, 'node_modules'])
          // add support for resolving plugins from node_modules
          .set('filename', filePath)
          // turn on url resolver in stylus, same as flag --resolve-url
          .set('resolve url', true)
          .define('url', stylus.resolver(undefined))
          .render()
      );
    }
    case '.css':
    default:
      return content;
  }
}

function optimizeCss(filePath: string, css: string, browsers: string[], cssUrl?: CssUrl): LazyResult {
  const postCssPlugins = [];

  if (cssUrl !== CssUrl.none) {
    postCssPlugins.push(postcssUrl({ url: cssUrl }));
  }

  // this is important to be executed post running `postcssUrl`
  postCssPlugins.push(autoprefixer(browsers));

  postCssPlugins.push(
    cssnano({
      preset: [
        'default',
        {
          // Disable SVG optimizations, as this can cause optimizations which are not compatible in all browsers.
          svgo: false,
          // Disable `calc` optimizations, due to several issues. #16910, #16875, #17890
          calc: false,
        },
      ],
    }),
  );

  return postcss(postCssPlugins).process(css, {
    from: filePath,
    to: filePath.replace(path.extname(filePath), '.css'),
  });
}

// default export for sync-rpc to recognize the function https://github.com/ForbesLindesay/sync-rpc#workerjs
export default function getStyleSheetProcessor(_connection: string) {
  // you can setup any connections you need here
  return processCss
}
