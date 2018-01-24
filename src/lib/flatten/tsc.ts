import * as path from 'path';
import { ScriptTarget, ModuleKind, TranspileOutput, transpileModule, CompilerOptions } from 'typescript';
import { readFile, outputJson, outputFile as fsOutputFile } from 'fs-extra';
import { debug } from '../util/log';

/**
 * Downlevels a .js file from ES2015 to ES5. Internally, uses `tsc`.
 *
 * @param inputFile
 * @param outputFile
 */
export async function downlevelWithTsc(inputFile: string, outputFile: string): Promise<void> {
  debug(`tsc ${inputFile} to ${outputFile}`);
  const inputBuffer: Buffer = await readFile(inputFile);
  const input: string = inputBuffer.toString();
  const compilerOptions: CompilerOptions = {
    target: ScriptTarget.ES5,
    module: ModuleKind.ES2015,
    allowJs: true,
    sourceMap: true,
    downlevelIteration: true,
    mapRoot: path.dirname(inputFile)
  };
  const transpiled: TranspileOutput = transpileModule(trimSourceMap(input.toString()), {
    fileName: path.basename(outputFile),
    moduleName: path.basename(outputFile, '.js'),
    compilerOptions
  });

  const sourceMap = JSON.parse(transpiled.sourceMapText);
  sourceMap['file'] = path.basename(outputFile);
  sourceMap['sources'] = [path.basename(inputFile)];

  await Promise.all([
    fsOutputFile(outputFile, transpiled.outputText),
    outputJson(`${outputFile}.map`, sourceMap, { spaces: 2 })
  ]);
}

const REGEXP = /\/\/# sourceMappingURL=.*\.js\.map/;
const trimSourceMap = (fileContent: string): string => {
  if (fileContent.match(REGEXP)) {
    return fileContent.replace(/\/\/# sourceMappingURL=.*\.js\.map/, '');
  } else {
    return fileContent;
  }
};
