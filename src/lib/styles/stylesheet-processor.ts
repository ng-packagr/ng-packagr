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
}

export class StylesheetProcessor {
  private readonly browserslistData: string[];
  private worker: Worker | undefined;
  private messageChannel: MessageChannel | undefined;

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

    if(!this.messageChannel) {
      this.messageChannel = new MessageChannel();
    }

    if(!this.worker) {
      this.worker = new Worker(join(__dirname, './stylesheet-processor-worker.js'));
    }

    try {
      const signal = new Int32Array(new SharedArrayBuffer(4));
      this.worker.postMessage({ signal, port: this.messageChannel.port1, workerOptions }, [
        this.messageChannel.port1
      ]);

      // Sleep until signal[0] is 0
      Atomics.wait(signal, 0, 0);

      const { css, warnings } = receiveMessageOnPort(this.messageChannel.port2).message;

      warnings.forEach(msg => log.warn(msg));
      return css;
    } finally {
      this.messageChannel.port1.unref();
      this.messageChannel.port2.unref();
      this.worker.unref();
    }
  }
}
