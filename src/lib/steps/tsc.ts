const fs = require('mz/fs');
const path = require('path');
import * as ts from 'typescript';
import { ScriptTarget, ModuleKind } from 'typescript';
import { debug } from '../util/log';

/**
 * Downlevels a .js file from ES2015 to ES5. Internally, uses `tsc`.
 *
 * @param inputFile Tran
 * @param outputFile
 */
export const downlevelWithTsc = (inputFile: string, outputFile: string) => {

  return Promise.resolve(debug(`tsc ${inputFile} to ${outputFile}`))
    .then(() => fs.readFile(inputFile))
    .then((input) => ts.transpileModule(trimSourceMap(input.toString()), {
      fileName: path.basename(outputFile),
      moduleName: path.basename(outputFile, '.js'),
      compilerOptions: {
        target: ScriptTarget.ES5,
        module: ModuleKind.ES2015,
        allowJs: true,
        sourceMap: true
      }
    }))
    .then((transpiled) => {
      const sourceMap = JSON.parse(transpiled.sourceMapText);
      sourceMap['file'] = path.basename(outputFile);
      sourceMap['sources'] = [path.basename(inputFile)];

      return Promise.all([
        fs.writeFile(outputFile, transpiled.outputText),
        fs.writeFile(`${outputFile}.map`, JSON.stringify(sourceMap))
      ]);
    });

};


const REGEXP = /\/\/# sourceMappingURL=.*\.js\.map/;
const trimSourceMap = (fileContent: string): string => {

  if (fileContent.match(REGEXP)) {
    return fileContent.replace(/\/\/# sourceMappingURL=.*\.js\.map/, '');
  } else {
    return fileContent;
  }

};
