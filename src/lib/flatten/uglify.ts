import { minify } from 'uglify-js';
import { writeFile, readFile } from 'fs-extra';
import { extname, basename } from 'path';
import { debug, warn } from './../util/log';

export async function minifyJsFile(inputPath: string): Promise<string> {
  debug(`minifyJsFile: ${inputPath}`);

  const fileExtension: string = extname(inputPath);
  const pathWithNoExtension: string = inputPath.substring(0, inputPath.length - fileExtension.length);

  const outputPath: string = `${pathWithNoExtension}.min${fileExtension}`;
  const sourcemapOut: string = `${outputPath}.map`;
  const [inputFileBuffer, inputSourceMapBuffer]: Buffer[] = await Promise.all([
    readFile(inputPath),
    readFile(`${inputPath}.map`)
  ]);

  const result = minify(inputFileBuffer.toString(), {
    sourceMap: {
      content: JSON.parse(inputSourceMapBuffer.toString()),
      url: basename(sourcemapOut)
    },
    parse: {
      bare_returns: true
    },
    ie8: true,
    warnings: true,
    output: {
      comments: 'some'
    }
  });

  if (result.warnings) {
    for (const warningMessage of result.warnings) {
      warn(warningMessage);
    }
  }

  if (result.error) {
    throw result.error;
  }

  await Promise.all([writeFile(outputPath, result.code), writeFile(sourcemapOut, result.map)]);
  return outputPath;
}
