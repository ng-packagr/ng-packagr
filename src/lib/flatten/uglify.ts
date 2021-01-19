import { minify } from 'terser';
import { basename } from 'path';
import { debug } from '../utils/log';
import { readFile, writeFile } from '../utils/fs';

export async function minifyJsFile(inputPath: string, outputPath?: string): Promise<void> {
  debug(`minifyJsFile: ${inputPath}`);

  const sourcemapOut = `${outputPath}.map`;
  const [inputFileBuffer, inputSourceMapBuffer]: Buffer[] = await Promise.all([
    readFile(inputPath),
    readFile(`${inputPath}.map`),
  ]);

  const result = await minify(inputFileBuffer.toString(), {
    sourceMap: {
      includeSources: true,
      content: JSON.parse(inputSourceMapBuffer.toString()),
      url: basename(sourcemapOut),
    },
    parse: {
      ecma: 5,
      bare_returns: true,
    },
    format: {
      comments: 'some',
    },
  });

  await Promise.all([writeFile(outputPath, result.code), writeFile(sourcemapOut, result.map as string)]);

  return;
}
