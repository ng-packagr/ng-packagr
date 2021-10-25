import * as browserslist from 'browserslist';
import { join } from 'path';
import * as findCacheDirectory from 'find-cache-dir';
import { tmpdir } from 'os';
import { MessageChannel, receiveMessageOnPort, Worker } from 'worker_threads';

import * as log from '../utils/log';
import { EsbuildExecutor } from '../esbuild/esbuild-executor';

export enum CssUrl {
  inline = 'inline',
  none = 'none',
}
export interface WorkerOptions {
  filePath: string;
  basePath: string;
  targets: string[];
  browserslistData: string[];
  cssUrl?: CssUrl;
  styleIncludePaths?: string[];
  cachePath: string;
  alwaysUseWasm: boolean;
}

export interface WorkerResult {
  css: string;
  warnings: string[];
  error?: string;
}

export class StylesheetProcessor {
  private browserslistData: string[] | undefined;
  private worker: Worker | undefined;
  private readonly cachePath: string;
  private targets: string[];
  private alwaysUseWasm = !EsbuildExecutor.hasNativeSupport();

  constructor(
    private readonly basePath: string,
    private readonly cssUrl?: CssUrl,
    private readonly styleIncludePaths?: string[],
  ) {
    this.cachePath = findCacheDirectory({ name: 'ng-packagr-styles' }) || tmpdir();
  }

  process(filePath: string) {
    if (!this.worker) {
      this.worker = new Worker(join(__dirname, './stylesheet-processor-worker.js'));
    }

    if (!this.browserslistData) {
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
    }

    const workerOptions: WorkerOptions = {
      filePath,
      basePath: this.basePath,
      cssUrl: this.cssUrl,
      styleIncludePaths: this.styleIncludePaths,
      browserslistData: this.browserslistData,
      cachePath: this.cachePath,
      targets: this.targets,
      alwaysUseWasm: this.alwaysUseWasm,
    };

    const ioChannel = new MessageChannel();

    try {
      const signal = new Int32Array(new SharedArrayBuffer(4));
      this.worker.postMessage({ signal, port: ioChannel.port1, workerOptions }, [ioChannel.port1]);

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
