const fs = require('fs');

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
