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
import * as sass from 'node-sass';
import * as stylus from 'stylus';

export class StylesheetProcessor {
  private postCssProcessor: postcss.Processor;

  constructor(readonly basePath: string, readonly cssUrl?: CssUrl, readonly styleIncludePaths?: string[]) {
    this.postCssProcessor = this.createPostCssProcessor(basePath, cssUrl, styleIncludePaths);
  }

  process(filePath: string, content: string) {
    // Render pre-processor language (sass, styl, less)
    const renderedCss: string = this.renderPreProcessor(filePath, content);

    // Render postcss (autoprefixing and friends)
    const result = this.postCssProcessor.process(renderedCss, {
      from: filePath,
      to: filePath.replace(path.extname(filePath), '.css')
    });

    // Log warnings from postcss
    result.warnings().forEach(msg => log.warn(msg.toString()));

    return result.css;
  }

  private renderPreProcessor(filePath: string, content: string): string {
    switch (path.extname(filePath)) {
      case '.scss':
        log.debug(`rendering scss from ${filePath}`);
        return sass
          .renderSync({
            file: filePath,
            data: content,
            importer: nodeSassTildeImporter,
            includePaths: this.styleIncludePaths
          })
          .css.toString();

      case '.sass':
        log.debug(`rendering sass from ${filePath}`);
        return sass
          .renderSync({
            file: filePath,
            data: content,
            indentedSyntax: true,
            importer: nodeSassTildeImporter,
            includePaths: this.styleIncludePaths
          })
          .css.toString();

      case '.less':
        log.debug(`rendering less from ${filePath}`);
        // this is the only way I found to make LESS sync
        let cmd = `node node_modules/less/bin/lessc ${filePath} --less-plugin-npm-import="prefix=~"`;
        if (this.styleIncludePaths.length) {
          cmd = `${cmd} --include-path=${this.styleIncludePaths.join(':')}`;
        }

        return execSync(cmd).toString();

      case '.styl':
      case '.stylus':
        log.debug(`rendering styl from ${filePath}`);
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
        log.debug(`reading css from ${filePath}`);
        return content;
    }
  }

  private createPostCssProcessor(basePath: string, cssUrl?: CssUrl, styleIncludePaths?: string[]): postcss.Processor {
    log.debug(`determine browserslist for ${basePath}`);
    const browsers = browserslist(undefined, { path: basePath });

    const postCssPlugins = [];

    if (cssUrl !== CssUrl.none) {
      log.debug(`postcssUrl: ${cssUrl}`);
      postCssPlugins.push(postcssUrl({ url: cssUrl }));
    }

    // this is important to be executed post running `postcssUrl`
    postCssPlugins.push(
      autoprefixer({ browsers, grid: true }),
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
}
