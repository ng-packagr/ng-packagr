import * as browserslist from 'browserslist';
import { join } from 'path';
import * as rpc from 'sync-rpc';

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
  warnings: string[];
}

export class StylesheetProcessor {
  private readonly browserslistData: string[];
  private readonly styleSheetProcessorWorker: (options: WorkerOptions) => WorkerResult = rpc(
    join(__dirname, './stylesheet-processor-worker.js'),
    StylesheetProcessor.name
  );

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

    const { css, warnings } = this.styleSheetProcessorWorker(workerOptions);

    warnings.forEach(msg => log.warn(msg));

    return css;
  }
}
