import * as browserslist from 'browserslist';
import postcss from 'postcss';
import * as postcssUrl from 'postcss-url';
import * as postcssPresetEnv from 'postcss-preset-env';
import * as log from '../utils/log';
import { extname } from 'path';
import { generateKey, readCacheEntry, saveCacheEntry } from '../utils/cache';
import { EsbuildExecutor } from '../esbuild/esbuild-executor';

export enum CssUrl {
  inline = 'inline',
  none = 'none',
}

export enum InlineStyleLanguage {
  sass = 'sass',
  scss = 'scss',
  css = 'css',
  less = 'less',
}

export interface Result {
  css: string;
  warnings: string[];
  error?: string;
}
export class StylesheetProcessor {
  private browserslistData: string[];
  private targets: string[];
  private postCssProcessor: ReturnType<typeof postcss>;
  private esbuild = new EsbuildExecutor();

  constructor(
    private readonly basePath: string,
    private readonly cssUrl?: CssUrl,
    private readonly styleIncludePaths?: string[],
    private readonly cacheDirectory?: string | false,
  ) {
    log.debug(`determine browserslist for ${this.basePath}`);
    // By default, browserslist defaults are too inclusive
    // https://github.com/browserslist/browserslist/blob/83764ea81ffaa39111c204b02c371afa44a4ff07/index.js#L516-L522

    // We change the default query to browsers that Angular support.
    // https://angular.io/guide/browser-support
    (browserslist.defaults as string[]) = [
      'last 1 Chrome version',
      'last 1 Firefox version',
      'last 2 Edge major versions',
      'last 2 Safari major versions',
      'last 2 iOS major versions',
      'Firefox ESR',
    ];

    this.browserslistData = browserslist(undefined, { path: this.basePath });
    this.targets = transformSupportedBrowsersToTargets(this.browserslistData);
    this.postCssProcessor = this.createPostCssPlugins();
  }

  async process({ filePath, content }: { filePath: string; content: string }): Promise<string> {
    let key: string | undefined;

    if (!content.includes('@import') && !content.includes('@use') && this.cacheDirectory) {
      // No transitive deps, we can cache more aggressively.
      key = generateKey(content, ...this.browserslistData);
      const result = await readCacheEntry(this.cacheDirectory, key);
      if (result) {
        result.warnings.forEach(msg => log.warn(msg));
        return result.css;
      }
    }

    // Render pre-processor language (sass, styl, less)
    const renderedCss = await this.renderCss(filePath, content);

    // We cannot cache CSS re-rendering phase, because a transitive dependency via (@import) can case different CSS output.
    // Example a change in a mixin or SCSS variable.
    if (!key) {
      key = generateKey(renderedCss, ...this.browserslistData);
    }

    if (this.cacheDirectory) {
      const cachedResult = await readCacheEntry(this.cacheDirectory, key);
      if (cachedResult) {
        cachedResult.warnings.forEach(msg => log.warn(msg));
        return cachedResult.css;
      }
    }
    // Render postcss (autoprefixing and friends)
    const result = await this.postCssProcessor.process(renderedCss, {
      from: filePath,
      to: filePath.replace(extname(filePath), '.css'),
    });

    const warnings = result.warnings().map(w => w.toString());
    const { code, warnings: esBuildWarnings } = await this.esbuild.transform(result.css, {
      loader: 'css',
      minify: true,
      target: this.targets,
      sourcefile: filePath,
    });

    if (esBuildWarnings.length > 0) {
      warnings.push(...(await this.esbuild.formatMessages(esBuildWarnings, { kind: 'warning' })));
    }

    if (this.cacheDirectory) {
      saveCacheEntry(
        this.cacheDirectory,
        key,
        JSON.stringify({
          css: code,
          warnings,
        }),
      );
    }
    warnings.forEach(msg => log.warn(msg));

    return code;
  }

  private createPostCssPlugins(): ReturnType<typeof postcss> {
    const postCssPlugins = [];
    if (this.cssUrl !== CssUrl.none) {
      postCssPlugins.push(postcssUrl({ url: this.cssUrl }));
    }

    postCssPlugins.push(
      postcssPresetEnv({
        browsers: this.browserslistData,
        autoprefixer: true,
        stage: 3,
      }),
    );

    return postcss(postCssPlugins);
  }

  private async renderCss(filePath: string, css: string): Promise<string> {
    const ext = extname(filePath);

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
            includePaths: this.styleIncludePaths,
          })
          .css.toString();
      }
      case '.less': {
        const { css: content } = await (
          await import('less')
        ).render(css, {
          filename: filePath,
          javascriptEnabled: true,
          paths: this.styleIncludePaths,
        });

        return content;
      }
      case '.styl':
      case '.stylus': {
        const stylus = (await import('stylus')).default;

        return (
          stylus(css)
            // add paths for resolve
            .set('paths', [this.basePath, '.', ...this.styleIncludePaths, 'node_modules'])
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
}

function transformSupportedBrowsersToTargets(supportedBrowsers: string[]): string[] {
  const transformed: string[] = [];

  // https://esbuild.github.io/api/#target
  const esBuildSupportedBrowsers = new Set(['safari', 'firefox', 'edge', 'chrome', 'ios']);

  for (const browser of supportedBrowsers) {
    let [browserName, version] = browser.split(' ');

    // browserslist uses the name `ios_saf` for iOS Safari whereas esbuild uses `ios`
    if (browserName === 'ios_saf') {
      browserName = 'ios';
      // browserslist also uses ranges for iOS Safari versions but only the lowest is required
      // to perform minimum supported feature checks. esbuild also expects a single version.
      [version] = version.split('-');
    }

    if (browserName === 'ie') {
      transformed.push('edge12');
    } else if (esBuildSupportedBrowsers.has(browserName)) {
      if (browserName === 'safari' && version === 'TP') {
        // esbuild only supports numeric versions so `TP` is converted to a high number (999) since
        // a Technology Preview (TP) of Safari is assumed to support all currently known features.
        version = '999';
      }

      transformed.push(browserName + version);
    }
  }

  return transformed.length ? transformed : undefined;
}
