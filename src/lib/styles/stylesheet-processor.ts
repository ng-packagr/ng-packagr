import { execFileSync } from 'child_process';
import * as browserslist from 'browserslist';
import * as log from '../utils/log';

export enum CssUrl {
  inline = 'inline',
  none = 'none',
}
export interface WorkerOptions {
  filePath: string;
  basePath: string;
  browserslistData: string[];
  cssUrl?: CssUrl;
  styleIncludePaths?: string[];
}

export interface WorkerResult {
  css: string;
  warnings: [];
}

export class StylesheetProcessor {
  private readonly browserslistData: string[];
  private readonly workerPath = require.resolve('./stylesheet-processor-worker');

  constructor(readonly basePath: string, readonly cssUrl?: CssUrl, readonly styleIncludePaths?: string[]) {
    log.debug(`determine browserslist for ${basePath}`);
    this.browserslistData = browserslist(undefined, { path: basePath });
  }

  process(filePath: string) {
    const workerOptions: WorkerOptions = {
      filePath,
      basePath: this.basePath,
      cssUrl: this.cssUrl,
      styleIncludePaths: this.styleIncludePaths,
      browserslistData: this.browserslistData,
    };

    const stdout = execFileSync(process.argv[0], [this.workerPath, JSON.stringify(workerOptions)], {
      windowsHide: true,
    });

    const { css, warnings }: WorkerResult = JSON.parse(stdout.toString());
    warnings.forEach(msg => log.warn(msg));

    return css;
  }
}
