const fs = require('mz/fs');
import * as ts from 'typescript';
import { ScriptTarget, ModuleKind } from 'typescript';
import { info } from '../util/log';

/**
 * Downlevels a .js file from ES2015 to ES5. Internally, uses `tsc`.
 *
 * @param inputFile Tran
 * @param outputFile
 */
export const downlevelWithTsc = (inputFile: string, outputFile: string) => {

  return Promise.resolve(info(`tsc ${inputFile} to ${outputFile}`))
    .then(() => fs.readFile(inputFile))
    .then((input) => ts.transpileModule(input.toString(), {
      fileName: inputFile,
      compilerOptions: {
        target: ScriptTarget.ES5,
        module: ModuleKind.ES2015,
        allowJs: true,
        sourceMap: true
      }
    }))
    .then((transpiled) => Promise.all([
      fs.writeFile(outputFile, transpiled.outputText),
      fs.writeFile(`${outputFile}.map`, transpiled.sourceMapText)
    ]));

};
