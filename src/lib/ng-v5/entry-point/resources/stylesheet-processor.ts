import * as path from 'path';
import * as log from '../../../util/log';
import { CssUrl } from '../../../ng-package-format/shared';
import { execSync } from 'child_process';

// CSS Tools
import * as autoprefixer from 'autoprefixer';
import * as browserslist from 'browserslist';
import * as nodeSassTildeImporter from 'node-sass-tilde-importer';
import * as postcss from 'postcss';
import * as postcssUrl from 'postcss-url';
import postcssClean from './postcss-clean';
import * as stylus from 'stylus';

/*
 * Please be aware of the few differences in behaviour https://github.com/sass/dart-sass/blob/master/README.md#behavioral-differences-from-ruby-sass
 * By default `npm install` will install sass.
 * To use node-sass you need to use:
 *   Npm:
 *     `npm install node-sass --save-dev`
 *   Yarn:
 *     `yarn add node-sass --dev`
 */
let sassComplier: any | undefined;
try {
  sassComplier = require('node-sass'); // Check if node-sass is explicitly included.
} catch {
  sassComplier = require('sass');
}

export class StylesheetProcessor {
  private postCssProcessor: postcss.Processor;

  constructor(readonly basePath: string, readonly cssUrl?: CssUrl, readonly styleIncludePaths?: string[]) {
    this.postCssProcessor = this.createPostCssProcessor(basePath, cssUrl);
  }

  process(filePath: string, content: string) {
    // Render pre-processor language (sass, styl, less)
    const renderedCss: string = this.renderPreProcessor(filePath, content);

    // Render postcss (autoprefixing and friends)
    const result = this.postCssProcessor.process(renderedCss, {
      from: filePath,
      to: filePath.replace(path.extname(filePath), '.css'),
    });

    // Log warnings from postcss
    result.warnings().forEach(msg => log.warn(msg.toString()));

    return result.css;
  }

  private renderPreProcessor(filePath: string, content: string): string {
    const ext = path.extname(filePath);

    log.debug(`rendering ${ext} from ${filePath}`);

    switch (ext) {
      case '.sass':
      case '.scss':
        return sassComplier
          .renderSync({
            file: filePath,
            data: content,
            indentedSyntax: '.sass' === ext,
            importer: nodeSassTildeImporter,
            includePaths: this.styleIncludePaths,
          })
          .css.toString();

      case '.less':
        // this is the only way I found to make LESS sync
        let cmd = `node "${require.resolve('less/bin/lessc')}" "${filePath}" --less-plugin-npm-import="prefix=~" --js`;
        if (this.styleIncludePaths.length) {
          cmd += ` --include-path="${this.styleIncludePaths.join(':')}"`;
        }

        return execSync(cmd).toString();

      case '.styl':
      case '.stylus':
        return (
          stylus(content)
            // add paths for resolve
            .set('paths', [this.basePath, '.', ...this.styleIncludePaths, 'node_modules'])
            // add support for resolving plugins from node_modules
            .set('filename', filePath)
            // turn on url resolver in stylus, same as flag --resolve-url
            .set('resolve url', true)
            .define('url', stylus.resolver(undefined))
            .render()
        );

      case '.css':
      default:
        return content;
    }
  }

  private createPostCssProcessor(basePath: string, cssUrl?: CssUrl): postcss.Processor {
    log.debug(`determine browserslist for ${basePath}`);
    const overrideBrowserslist = browserslist(undefined, { path: basePath });

    const postCssPlugins = [];

    if (cssUrl !== CssUrl.none) {
      log.debug(`postcssUrl: ${cssUrl}`);
      postCssPlugins.push(postcssUrl({ url: cssUrl }));
    }

    // this is important to be executed post running `postcssUrl`
    postCssPlugins.push(
      autoprefixer({ overrideBrowserslist, grid: true }),
      postcssClean({
        level: {
          2: {
            specialComments: false,
          },
        },
      }),
    );

    return postcss(postCssPlugins);
  }
}
