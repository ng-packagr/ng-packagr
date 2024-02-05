import { dirname, extname, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { workerData } from 'node:worker_threads';
import postcss from 'postcss';
import { EsbuildExecutor } from '../esbuild/esbuild-executor';
import { generateKey, readCacheEntry, saveCacheEntry } from '../utils/cache';
import * as log from '../utils/log';
import {createCssResourcePlugin} from './css-resource-plugin';
import { PostcssConfiguration } from './postcss-configuration';
import { CssUrl } from './stylesheet-processor';

const {
  tailwindConfigPath,
  projectBasePath,
  browserslistData,
  targets,
  cssUrl,
  styleIncludePaths,
  postcssConfiguration,
} = workerData as {
  tailwindConfigPath: string | undefined;
  postcssConfiguration: PostcssConfiguration | undefined;
  browserslistData: string;
  targets: string[];
  projectBasePath: string;
  cssUrl: CssUrl;
  styleIncludePaths: string[];
  cacheDirectory: string | undefined;
};

let cacheDirectory = workerData.cacheDirectory;
let postCssProcessor: ReturnType<typeof postcss> | undefined;
let esbuild: EsbuildExecutor;

interface RenderRequest {
  content: string;
  filePath: string;
}

const CACHE_KEY_VALUES = [...browserslistData, ...styleIncludePaths, cssUrl].join(':');

/**
 * An array of keywords that indicate Tailwind CSS processing is required for a stylesheet.
 *
 * Based on https://tailwindcss.com/docs/functions-and-directives
 */
const TAILWIND_KEYWORDS = [
  '@tailwind',
  '@layer',
  '@apply',
  '@config',
  'theme(',
  'screen(',
  '@screen', // Undocumented in version 3, see: https://github.com/tailwindlabs/tailwindcss/discussions/7516.
];

async function render({ content, filePath }: RenderRequest): Promise<string> {
  let key: string | undefined;
  if (cacheDirectory && !content.includes('@import') && !content.includes('@use')) {
    // No transitive deps, we can cache more aggressively.
    key = await generateKey(content, CACHE_KEY_VALUES);
    const result = await readCacheEntry(cacheDirectory, key);
    if (result) {
      result.warnings.forEach(msg => log.warn(msg));

      return result.css;
    }
  }

  // Render pre-processor language (sass, styl, less)
  let renderedCss = await renderCss(filePath, content);

  // We cannot cache CSS re-rendering phase, because a transitive dependency via (@import) can case different CSS output.
  // Example a change in a mixin or SCSS variable.
  if (!key) {
    key = await generateKey(renderedCss, CACHE_KEY_VALUES);
  }

  if (cacheDirectory) {
    const cachedResult = await readCacheEntry(cacheDirectory, key);
    if (cachedResult) {
      cachedResult.warnings.forEach(msg => log.warn(msg));

      return cachedResult.css;
    }
  }

  const warnings: string[] = [];
  if (postCssProcessor && (postcssConfiguration || (tailwindConfigPath && hasTailwindKeywords(renderedCss)))) {
    const result = await postCssProcessor.process(renderedCss, {
      from: filePath,
      to: filePath.replace(extname(filePath), '.css'),
    });

    warnings.push(...result.warnings().map(w => w.toString()));
    renderedCss = result.css;
  }

  const {
    outputFiles,
    warnings: esBuildWarnings,
    errors: esbuildErrors,
  } = await esbuild.build({
    stdin: {
      contents: renderedCss,
      loader: 'css',
      resolveDir: dirname(filePath),
    },
    plugins: [createCssResourcePlugin(cssUrl)],
    write: false,
    sourcemap: false,
    minify: true,
    bundle: true,
    absWorkingDir: projectBasePath,
    target: targets,
  });

  const code = outputFiles[0].text;
  if (esBuildWarnings.length > 0) {
    warnings.push(...(await esbuild.formatMessages(esBuildWarnings, { kind: 'warning' })));
    warnings.forEach(msg => log.warn(msg));
  }

  if (esbuildErrors.length > 0) {
    const errors = await esbuild.formatMessages(esBuildWarnings, { kind: 'error' });
    errors.forEach(msg => log.error(msg));

    throw new Error(`An error has occuried while processing ${filePath}.`);
  }

  if (cacheDirectory) {
    await saveCacheEntry(
      cacheDirectory,
      key,
      JSON.stringify({
        css: code,
        warnings,
      }),
    );
  }

  return code;
}

async function renderCss(filePath: string, css: string): Promise<string> {
  const ext = extname(filePath);

  switch (ext) {
    case '.sass':
    case '.scss': {
      return (await import('sass')).compileString(css, {
        url: pathToFileURL(filePath),
        syntax: '.sass' === ext ? 'indented' : 'scss',
        loadPaths: styleIncludePaths,
      }).css;
    }
    case '.less': {
      const { css: content } = await (
        await import('less')
      ).default.render(css, {
        filename: filePath,
        javascriptEnabled: true,
        paths: styleIncludePaths,
      });

      return content;
    }

    case '.css':
    default:
      return css;
  }
}

function getTailwindPlugin() {
  // Attempt to setup Tailwind CSS
  // Only load Tailwind CSS plugin if configuration file was found.
  // This acts as a guard to ensure the project actually wants to use Tailwind CSS.
  // The package may be unknowningly present due to a third-party transitive package dependency.
  if (tailwindConfigPath) {
    let tailwindPackagePath;
    try {
      tailwindPackagePath = require.resolve('tailwindcss', { paths: [projectBasePath] });
    } catch {
      const relativeTailwindConfigPath = relative(projectBasePath, tailwindConfigPath);
      log.warn(
        `Tailwind CSS configuration file found (${relativeTailwindConfigPath})` +
          ` but the 'tailwindcss' package is not installed.` +
          ` To enable Tailwind CSS, please install the 'tailwindcss' package.`,
      );
    }

    if (tailwindPackagePath) {
      return require(tailwindPackagePath)({ config: tailwindConfigPath });
    }
  }
}

async function initialize() {
  const postCssPlugins = [];
  if (postcssConfiguration) {
    for (const [pluginName, pluginOptions] of postcssConfiguration.plugins) {
      const { default: plugin } = await import(pluginName);

      if (typeof plugin !== 'function' || plugin.postcss !== true) {
        throw new Error(`Attempted to load invalid Postcss plugin: "${pluginName}"`);
      }

      postCssPlugins.push(plugin(pluginOptions));
    }
  } else {
    const tailwinds = getTailwindPlugin();
    if (tailwinds) {
      postCssPlugins.push(tailwinds);
      cacheDirectory = undefined;
    }
  }

  if (postCssPlugins.length) {
    postCssProcessor = postcss(postCssPlugins);
  }

  esbuild = new EsbuildExecutor();

  // Return the render function for use
  return render;
}

/**
 * Searches the provided contents for keywords that indicate Tailwind is used
 * within a stylesheet.
 */
function hasTailwindKeywords(contents: string): boolean {
  // TODO: use better search algorithm for keywords
  return TAILWIND_KEYWORDS.some(keyword => contents.includes(keyword));
}

/**
 * The default export will be the promise returned by the initialize function.
 * This is awaited by piscina prior to using the Worker.
 */
export default initialize();
