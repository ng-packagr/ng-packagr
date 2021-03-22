import * as browserslist from 'browserslist';
import { join } from 'path';
import { MessageChannel, receiveMessageOnPort, Worker } from 'worker_threads';

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
  error?: string;
}

export class StylesheetProcessor {
  private browserslistData: string[] | undefined;
  private worker: Worker | undefined;

  constructor(private readonly basePath: string, private readonly cssUrl?: CssUrl, private readonly styleIncludePaths?: string[]) { }

  process(filePath: string) {
    const workerOptions: WorkerOptions = {
      filePath,
      basePath: this.basePath,
      cssUrl: this.cssUrl,
      styleIncludePaths: this.styleIncludePaths,
      browserslistData: this.browserslistData,
    };

    if (!this.worker) {
      this.worker = new Worker(join(__dirname, './stylesheet-processor-worker.js'));
    }

    if (!this.browserslistData) {
      log.debug(`determine browserslist for ${this.basePath}`);
      this.browserslistData = browserslist(undefined, { path: this.basePath });
    }

    const ioChannel = new MessageChannel();

    try {
      const signal = new Int32Array(new SharedArrayBuffer(4));
      this.worker.postMessage({ signal, port: ioChannel.port1, workerOptions }, [
        ioChannel.port1
      ]);

      // Sleep until signal[0] is 0
      Atomics.wait(signal, 0, 0);

      const { css, warnings, error } = receiveMessageOnPort(ioChannel.port2).message;
      if (error) {
        throw new Error(error);
      }

      warnings.forEach(msg => log.warn(msg));
      return css;
    } finally {
      ioChannel.port1.close();
      ioChannel.port2.close();
      this.worker.unref();
    }
  }
}
