import * as cacache from 'cacache';
import { createHash } from 'crypto';
import * as path from 'path';
import postcss, { LazyResult } from 'postcss';
import * as postcssUrl from 'postcss-url';
import * as cssnano from 'cssnano';
import { parentPort } from 'worker_threads';
import * as postcssPresetEnv from 'postcss-preset-env';

import { CssUrl, WorkerOptions, WorkerResult } from './stylesheet-processor';
import { readFile } from '../utils/fs';

const ngPackagrVersion = require('../../package.json').version;

async function processCss({
  filePath,
  browserslistData,
  cssUrl,
  styleIncludePaths,
  basePath,
  cachePath,
}: WorkerOptions): Promise<WorkerResult> {
  const content = await readFile(filePath, 'utf8');
  let key: string | undefined;

  if (!content.includes('@import') && !content.includes('@use')) {
    // No transitive deps, we can cache more aggressively.
    key = generateKey(content, browserslistData);
    const result = await readCacheEntry(cachePath, key);
    if (result) {
      return result;
    }
  }

  // Render pre-processor language (sass, styl, less)
  const renderedCss = await renderCss(filePath, content, basePath, styleIncludePaths);

  // We cannot cache CSS re-rendering phase, because a transitive dependency via (@import) can case different CSS output.
  // Example a change in a mixin or SCSS variable.
  if (!key) {
    key = generateKey(renderedCss, browserslistData);
  }

  const cachedResult = await readCacheEntry(cachePath, key);
  if (cachedResult) {
    return cachedResult;
  }

  // Render postcss (autoprefixing and friends)
  const result = await optimizeCss(filePath, renderedCss, browserslistData, cssUrl);

  // Add to cache
  await cacache.put(cachePath, key, result.css);

  return {
    css: result.css,
    warnings: result.warnings().map(w => w.toString()),
  };
}

async function renderCss(
  filePath: string,
  css: string,
  basePath: string,
  styleIncludePaths?: string[],
): Promise<string> {
  const ext = path.extname(filePath);

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
          data: css,
          indentedSyntax: '.sass' === ext,
          importer: await import('node-sass-tilde-importer'),
          includePaths: styleIncludePaths,
        })
        .css.toString();
    }
    case '.less': {
      const { css: content } = await (await import('less')).render(css, {
        filename: filePath,
        javascriptEnabled: true,
        paths: styleIncludePaths,
      });

      return content;
    }
    case '.styl':
    case '.stylus': {
      const stylus = await import('stylus');

      return (
        stylus(css)
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
      return css;
  }
}

function optimizeCss(filePath: string, css: string, browsers: string[], cssUrl?: CssUrl): LazyResult {
  const postCssPlugins = [];

  if (cssUrl !== CssUrl.none) {
    postCssPlugins.push(postcssUrl({ url: cssUrl }));
  }

  postCssPlugins.push(
    postcssPresetEnv({
      browsers,
      autoprefixer: true,
      stage: 3,
    }),
    cssnano({
      preset: [
        'default',
        {
          // Disable SVG optimizations, as this can cause optimizations which are not compatible in all browsers.
          svgo: false,
          // Disable `calc` optimizations, due to several issues. #16910, #16875, #17890
          calc: false,
          // Disable CSS rules sorted due to several issues #20693, https://github.com/ionic-team/ionic-framework/issues/23266 and https://github.com/cssnano/cssnano/issues/1054
          cssDeclarationSorter: false,
        },
      ],
    }),
  );

  return postcss(postCssPlugins).process(css, {
    from: filePath,
    to: filePath.replace(path.extname(filePath), '.css'),
  });
}

function generateKey(content: string, browserslistData: string[]): string {
  return createHash('sha1').update(ngPackagrVersion).update(content).update(browserslistData.join('')).digest('base64');
}

async function readCacheEntry(cachePath: string, key: string): Promise<WorkerResult | undefined> {
  const entry = await cacache.get.info(cachePath, key);
  if (entry) {
    return {
      css: await readFile(entry.path, 'utf8'),
      warnings: [],
    };
  }

  return undefined;
}

parentPort.on('message', async ({ signal, port, workerOptions }) => {
  try {
    const result = await processCss(workerOptions);
    port.postMessage({ ...result });
  } catch (error) {
    port.postMessage({ error: error.message });
  } finally {
    // Change the value of signal[0] to 1
    Atomics.add(signal, 0, 1);
    // Unlock the main thread
    Atomics.notify(signal, 0);
    port.close();
  }
});
