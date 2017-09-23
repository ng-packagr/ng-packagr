import * as fs from 'fs';
import * as path from 'path';
const read = require('read-file');

export const readFile = (file: string): Promise<string> => {

  return new Promise<string>((resolve, reject) => {

    const fileReadOptions = {
      encoding: 'utf8',
      normalize: true
    };
    read(file, fileReadOptions, (err, buffer?: Buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer!.toString());
      }
    });
  });
};

export const writeFile = (file: string, content: any): Promise<void> => {

  return new Promise<void>((resolve, reject): void => {
    fs.writeFile(file, content, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};


export const findFromDirectory = (dir: string, file: string, cb: any) => {

  let fileName = path.resolve(dir, file);
  fs.access(fileName, fs.constants.R_OK, (err) => {
    if (err) {
      findFromDirectory(path.resolve(dir, '..'), file, cb);
    } else {
      cb(fileName);
    }
  });
};
