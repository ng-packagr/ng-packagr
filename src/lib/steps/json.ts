const fs = require('fs');
const glob = require('glob')
import * as mz from 'mz/fs';

/**
 * Reads a JSON file.
 *
 * @param file Source file name.
 */
export const readJson = (file: string): Promise<any> => {

  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject(err);
      }

      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });

  });
}


/**
 * Writes a JSON file.
 *
 * @param object Object literal that is stringified.
 * @param file Target file name.
 */
export const writeJson = (object: any, file: string): Promise<any> => {

  return new Promise((resolve, reject) => {

    const content = JSON.stringify(object, undefined, 2);
    fs.writeFile(file, content, (err) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}


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
      fileNames.map((fileName: string): Promise<string> => mz.readFile(fileName)
        .then((fileContent: string) => mz.writeFile(fileName, JSON.stringify(modifyFn(JSON.parse(fileContent)))))
      ))
    )
    .then(() => Promise.resolve());

};
