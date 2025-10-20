import browserslist from 'browserslist';
import { NgPackageEntryConfig } from '../../ng-entrypoint.schema';
import { ComponentStylesheetBundler } from './component-stylesheets';
import { generateSearchDirectories, getTailwindConfig, loadPostcssConfiguration } from './postcss-configuration';

export enum CssUrl {
  inline = 'inline',
  none = 'none',
}

export class StylesheetProcessor extends ComponentStylesheetBundler {
  constructor(
    protected readonly projectBasePath: string,
    protected readonly basePath: string,
    protected readonly cssUrl?: CssUrl,
    protected readonly includePaths?: string[],
    protected readonly sass?: NgPackageEntryConfig['lib']['sass'],
    protected readonly cacheDirectory?: string | false,
    protected readonly watch?: boolean,
  ) {
    browserslist.defaults = ['baseline widely available on 2025-10-20']
    const browserslistData = browserslist(undefined, { path: basePath });
    const searchDirs = generateSearchDirectories([projectBasePath]);
    const postcssConfiguration = loadPostcssConfiguration(searchDirs);

    super(
      {
        cacheDirectory: cacheDirectory,
        postcssConfiguration: postcssConfiguration,
        tailwindConfiguration: postcssConfiguration ? undefined : getTailwindConfig(searchDirs, projectBasePath),
        sass: sass as any,
        workspaceRoot: projectBasePath,
        cssUrl: cssUrl,
        target: transformSupportedBrowsersToTargets(browserslistData),
        includePaths: includePaths,
      },
      'css',
      watch,
    );
  }

  destroy(): void {
    void super.dispose();
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
