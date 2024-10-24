import type { BuildOptions, Plugin } from 'esbuild';
import path from 'node:path';
import { LoadResultCache } from '../load-result-cache';
import { PostcssConfiguration } from '../postcss-configuration';
import { CssStylesheetLanguage } from './css-language';
import { createCssResourcePlugin } from './css-resource-plugin';
import { LessStylesheetLanguage } from './less-language';
import { SassStylesheetLanguage } from './sass-language';
import { StylesheetPluginFactory, StylesheetPluginsass } from './stylesheet-plugin-factory';

export enum CssUrl {
  inline = 'inline',
  none = 'none',
}

export interface BundleStylesheetOptions {
  workspaceRoot: string;
  includePaths?: string[];
  cssUrl: CssUrl;
  sass?: StylesheetPluginsass;
  target: string[];
  tailwindConfiguration?: { file: string; package: string };
  postcssConfiguration?: PostcssConfiguration;
  cacheDirectory?: string | false;
}

export function createStylesheetBundleOptions(
  options: BundleStylesheetOptions,
  cache?: LoadResultCache,
  inlineComponentData?: Record<string, string>,
): BuildOptions & { plugins: NonNullable<BuildOptions['plugins']> } {
  // Ensure preprocessor include paths are absolute based on the workspace root
  const includePaths = options.includePaths?.map(includePath => path.resolve(options.workspaceRoot, includePath));

  const pluginFactory = new StylesheetPluginFactory(
    {
      sourcemap: false,
      includePaths,
      inlineComponentData,
      tailwindConfiguration: options.tailwindConfiguration,
      postcssConfiguration: options.postcssConfiguration,
      sass: options.sass,
    },
    cache,
  );

  const plugins: Plugin[] = [
    pluginFactory.create(SassStylesheetLanguage),
    pluginFactory.create(LessStylesheetLanguage),
    pluginFactory.create(CssStylesheetLanguage),
    createCssResourcePlugin(options.cssUrl, cache),
  ];

  return {
    absWorkingDir: options.workspaceRoot,
    bundle: true,
    logLevel: 'silent',
    minify: true,
    metafile: true,
    sourcemap: false,
    outdir: options.workspaceRoot,
    write: false,
    platform: 'browser',
    target: options.target,
    conditions: ['style', 'sass', 'less', 'production'],
    mainFields: ['style', 'sass'],
    // Unlike JS, CSS does not have implicit file extensions in the general case.
    // Preprocessor specific behavior is handled in each stylesheet language plugin.
    resolveExtensions: [],
    plugins,
  };
}
