import { extname } from 'path';
import { Options } from 'pug';
import { generateKey, readCacheEntry, saveCacheEntry } from '../utils/cache';

export interface Result {
  html: string;
}

export class TemplateProcessor {
  private pugOptions: Options;

  constructor(basePath: string, private readonly cacheDirectory?: string | false) {
    this.pugOptions = {
      doctype: 'html',
      pretty: false,
      compileDebug: false,
      globals: ['require'],
      name: 'template',
      inlineRuntimeFunctions: false,
      basedir: basePath,
    };
  }

  async process({ filePath, content }: { filePath: string; content: string }): Promise<string> {
    let key: string | undefined;
    const ext = extname(filePath);

    if (
      this.cacheDirectory &&
      (!['.pug', '.jade'].includes(ext) || (!content.includes('include ') && !content.includes('extends ')))
    ) {
      // No transitive deps, we can cache more aggressively.
      key = await generateKey(content);
      const result = (await readCacheEntry(this.cacheDirectory, key)) as Result;
      if (result) {
        return result.html;
      }
    }

    // Render pre-processor language (Pug)
    const renderedHtml = await this.renderHtml(filePath, content);

    // We cannot cache HTML re-rendering phase, because a transitive dependency via (include/extends)
    // can case different HTML output.
    // Example a change in a mixin or Pug variable.
    if (!key) {
      key = await generateKey(renderedHtml);
    }

    if (this.cacheDirectory) {
      const cachedResult = (await readCacheEntry(this.cacheDirectory, key)) as Result;
      if (cachedResult) {
        return cachedResult.html;
      }
    }

    if (this.cacheDirectory) {
      await saveCacheEntry(
        this.cacheDirectory,
        key,
        JSON.stringify({
          html: renderedHtml,
        }),
      );
    }

    return renderedHtml;
  }

  private async renderHtml(filePath: string, sourceContent: string): Promise<string> {
    const ext = extname(filePath);

    switch (ext) {
      case '.pug':
      case '.jade': {
        return (await import('pug')).compile(sourceContent, this.pugOptions)();
      }
      case '.html':
      default:
        return sourceContent;
    }
  }
}
