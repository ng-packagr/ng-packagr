const glob = require('glob')
import { readFile, writeFile } from '../util/fs';

/**
 * Reads a JSON file.
 *
 * @param file Source file name.
 */
export const readJson = (file: string): Promise<any> =>
  readFile(file)
    .then((content: string) => Promise.resolve(JSON.parse(content)));


/**
 * Writes a JSON file.
 *
 * @param object Object literal that is stringified.
 * @param file Target file name.
 */
export const writeJson = (object: any, file: string): Promise<any> =>
  writeFile(file, JSON.stringify(object, undefined, 2));


/**
 * Modifies a set of JSON files by invoking `modifyFn`
 *
 * @param globPattern A glob pattern matching several files. Example: '**\/*.js.map'
 * @param modifyFn A callback function that tajes a JSON-parsed input and should return an output
 *                  that will be JSON-stringified
 */
export const modifyJsonFiles = (globPattern: string, modifyFn: (jsonObj: any) => any): Promise<void> => {

  return new Promise<string[]>((resolve, reject) => {
      glob(globPattern, (err, files: string[]) => {
        if (err) {
          reject(err);
        }

        resolve(files);
      });
    })
    .then((fileNames: string[]): Promise<string[]> => Promise.all(
      fileNames.map((fileName: string): Promise<string> => readFile(fileName)
        .then((fileContent: string) => writeFile(fileName, JSON.stringify(modifyFn(JSON.parse(fileContent)))))
      ))
    )
    .then(() => Promise.resolve());

};
