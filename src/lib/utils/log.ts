/* eslint-disable no-console */
import { colors } from './color';

export const error = (err: string | Error) => {
  if (err instanceof Error) {
    console.error(colors.red('ERROR: ' + err.message));

    if (process.env.DEBUG) {
      console.error(colors.red(err.stack) + '\n');
    }
  } else {
    console.error(colors.red(err));
  }
};

export const warn = (msg: string) => {
  console.warn(colors.yellow('WARNING: ' + msg));
};

export const success = (msg: string) => {
  console.log(colors.green(msg));
};

export const info = (msg: string) => {
  console.log(colors.blue(msg));
};

export const msg = (msg: string) => {
  console.log(colors.white(msg));
};

export const debug = (msg: string) => {
  if (process.env.DEBUG) {
    console.log(colors.inverse.cyan(`[debug] ${msg}`));
  }
};
