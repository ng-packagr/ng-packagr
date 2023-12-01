import { dirname, extname, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { workerData } from 'node:worker_threads';
import postcss from 'postcss';
import { EsbuildExecutor } from '../esbuild/esbuild-executor';
import { generateKey, readCacheEntry, saveCacheEntry } from '../utils/cache';
import * as log from '../utils/log';
import { CssUrl } from './stylesheet-processor';

const { tailwindConfigPath, projectBasePath, browserslistData, targets, cssUrl, styleIncludePaths } = workerData as {
  tailwindConfigPath: string | undefined;
  browserslistData: string;
  targets: string[];
  projectBasePath: string;
  cssUrl: CssUrl;
  styleIncludePaths: string[];
  cacheDirectory: string | undefined;
};

let cacheDirectory = workerData.cacheDirectory;
let postCssProcessor: ReturnType<typeof postcss>;
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
const TAILWIND_KEYWORDS = ['@tailwind', '@layer', '@apply', '@config', 'theme(', 'screen('];

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
  if (hasTailwindKeywords(renderedCss)) {
    const result = await postCssProcessor.process(renderedCss, {
      from: filePath,
      to: filePath.replace(extname(filePath), '.css'),
    });

    warnings.push(...result.warnings().map(w => w.toString()));
    renderedCss = result.css;
  }

  const loader = cssUrl === CssUrl.none ? 'empty' : 'dataurl';

  const { outputFiles, warnings: esBuildWarnings } = await esbuild.build({
    stdin: {
      contents: renderedCss,
      loader: 'css',
      resolveDir: dirname(filePath),
    },
    loader: {
      '.svg': loader,
      '.jpg': loader,
      '.jpeg': loader,
      '.png': loader,
      '.apng': loader,
      '.webp': loader,
      '.avif': loader,
      '.gif': loader,
      '.otf': loader,
      '.ttf': loader,
      '.woff': loader,
      '.woff2': loader,
    },
    write: false,
    sourcemap: false,
    minify: true,
    target: targets,
  });

  const code = outputFiles[0].text;
  if (esBuildWarnings.length > 0) {
    warnings.push(...(await esbuild.formatMessages(esBuildWarnings, { kind: 'warning' })));
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

  warnings.forEach(msg => log.warn(msg));

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

let usesTailwind = false;
async function initialize() {
  const postCssPlugins = [];
  const tailwinds = getTailwindPlugin();
  if (tailwinds) {
    usesTailwind = true;
    postCssPlugins.push(tailwinds);
    cacheDirectory = undefined;
  }

  postCssProcessor = postcss(postCssPlugins);

  esbuild = new EsbuildExecutor();

  // Return the render function for use
  return render;
}

/**
 * Searches the provided contents for keywords that indicate Tailwind is used
 * within a stylesheet.
 */
function hasTailwindKeywords(contents: string): boolean {
  if (!usesTailwind) {
    return false;
  }

  // TODO: use better search algorithm for keywords
  return TAILWIND_KEYWORDS.some(keyword => contents.includes(keyword));
}

/**
 * The default export will be the promise returned by the initialize function.
 * This is awaited by piscina prior to using the Worker.
 */
export default initialize();
