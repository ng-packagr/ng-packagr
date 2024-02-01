import browserslist from 'browserslist';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import Piscina from 'piscina';
import { colors } from '../utils/color';
import { loadPostcssConfiguration } from './postcss-configuration';

const maxWorkersVariable = process.env['NG_BUILD_MAX_WORKERS'];
const maxThreads = typeof maxWorkersVariable === 'string' && maxWorkersVariable !== '' ? +maxWorkersVariable : 4;

export enum CssUrl {
  inline = 'inline',
  none = 'none',
}

export class StylesheetProcessor {
  private renderWorker: Piscina | undefined;

  constructor(
    private readonly projectBasePath: string,
    private readonly basePath: string,
    private readonly cssUrl?: CssUrl,
    private readonly includePaths?: string[],
    private readonly cacheDirectory?: string | false,
  ) {
    // By default, browserslist defaults are too inclusive
    // https://github.com/browserslist/browserslist/blob/83764ea81ffaa39111c204b02c371afa44a4ff07/index.js#L516-L522
    // We change the default query to browsers that Angular support.
    // https://angular.io/guide/browser-support
    (browserslist.defaults as string[]) = [
      'last 2 Chrome versions',
      'last 1 Firefox version',
      'last 2 Edge major versions',
      'last 2 Safari major versions',
      'last 2 iOS major versions',
      'Firefox ESR',
    ];
  }

  async process({ filePath, content }: { filePath: string; content: string }): Promise<string> {
    await this.createRenderWorker();

    return this.renderWorker.run({ content, filePath });
  }

  /** Destory workers in pool. */
  destroy(): void {
    void this.renderWorker?.destroy();
  }

  private async createRenderWorker(): Promise<void> {
    if (this.renderWorker) {
      return;
    }

    const styleIncludePaths = [...this.includePaths];
    let prevDir = null;
    let currentDir = this.basePath;

    while (currentDir !== prevDir) {
      const p = join(currentDir, 'node_modules');
      if (existsSync(p)) {
        styleIncludePaths.push(p);
      }

      prevDir = currentDir;
      currentDir = dirname(prevDir);
    }

    const browserslistData = browserslist(undefined, { path: this.basePath });

    this.renderWorker = new Piscina({
      filename: require.resolve('./stylesheet-processor-worker'),
      maxThreads,
      env: {
        ...process.env,
        FORCE_COLOR: '' + colors.enabled,
      },
      workerData: {
        postcssConfiguration: await loadPostcssConfiguration(this.projectBasePath),
        tailwindConfigPath: getTailwindConfigPath(this.projectBasePath),
        projectBasePath: this.projectBasePath,
        browserslistData,
        targets: transformSupportedBrowsersToTargets(browserslistData),
        cacheDirectory: this.cacheDirectory,
        cssUrl: this.cssUrl,
        styleIncludePaths,
      },
    });
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
    }

    // browserslist uses ranges `15.2-15.3` versions but only the lowest is required
    // to perform minimum supported feature checks. esbuild also expects a single version.
    [version] = version.split('-');

    if (esBuildSupportedBrowsers.has(browserName)) {
      if (browserName === 'safari' && version === 'tp') {
        // esbuild only supports numeric versions so `TP` is converted to a high number (999) since
        // a Technology Preview (TP) of Safari is assumed to support all currently known features.
        version = '999';
      }

      transformed.push(browserName + version);
    }
  }

  return transformed.length ? transformed : undefined;
}

/** The list of valid config files can be found https://github.com/tailwindlabs/tailwindcss/blob/ba5454543e74a6d702ce11b410d27672c2ee4b3f/src/util/resolveConfigPath.js#L4-L9*/
const tailwindConfigFiles = [
  './tailwind.config.js',
  './tailwind.config.cjs',
  './tailwind.config.mjs',
  './tailwind.config.ts',
];

function getTailwindConfigPath(projectRoot: string): string | undefined {
  // A configuration file can exist in the project or workspace root
  for (const configFile of tailwindConfigFiles) {
    // Irrespective of the name project level configuration should always take precedence.
    const fullPath = join(projectRoot, configFile);
    if (existsSync(fullPath)) {
      return fullPath;
    }
  }

  return undefined;
}
