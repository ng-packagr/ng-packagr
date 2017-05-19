import * as fs from 'fs';
import * as ts from 'typescript';
import {ScriptTarget, ModuleKind} from 'typescript';
import { debug } from '../util/log';

/**
 * Downlevels a .js file from ES2015 to ES5. Internally, uses `tsc`.
 *
 * @param inputFile Tran
 * @param outputFile
 */
export const downlevelWithTsc = (inputFile: string, outputFile: string) => {

  debug(`tsc ${inputFile} to ${outputFile}`);

  let input = fs.readFileSync(inputFile, 'utf-8');
  let transpiled = ts.transpileModule(input, {
    compilerOptions: {
      target: ScriptTarget.ES5,
      module: ModuleKind.ES2015,
      allowJs: true
    }
  });
  fs.writeFileSync(outputFile, transpiled.outputText);
  fs.writeFileSync(`${outputFile}.map`, transpiled.sourceMapText);

  return Promise.resolve();
};
