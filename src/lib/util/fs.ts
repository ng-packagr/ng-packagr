import * as fs from 'fs';
import * as path from 'path';
const read = require('read-file');
import { promisify } from './promisify';

export const readFile = (file: string): Promise<string> => {

  return promisify<string>((resolveOrReject) => {
    const fileReadOptions = {
      encoding: 'utf8',
      normalize: true
    };
    read(file, fileReadOptions, (err, buffer?: Buffer) => {
      if (buffer) {
        resolveOrReject(err, buffer.toString());
      } else {
        resolveOrReject(err);
      }
    });
  });

};

export const writeFile = (file: string, content: any): Promise<string> => {

  return promisify<string>((resolveOrReject) => {
    fs.writeFile(file, content, resolveOrReject);
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
