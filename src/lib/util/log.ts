import chalk from 'chalk';

export const error = (err: string | Error) => {
  if (err instanceof Error) {
    console.error(chalk.red('ERROR: ' + err.message));

    if (process.env.DEBUG) {
      console.error(chalk.red(err.stack) + '\n');
    }
  } else {
    console.error(chalk.red(err));
  }
};

export const warn = (msg: string) => {
  console.warn(chalk.yellow('WARNING: ' + msg));
};

export const success = (msg: string) => {
  console.log(chalk.green(msg));
};

export const info = (msg: string) => {
  console.log(chalk.blue(msg));
};

export const msg = (msg: string) => {
  console.log(chalk.white(msg));
};

export const debug = (msg: string) => {
  if (process.env.DEBUG) {
    console.log(chalk.inverse.cyan(`[debug] ${msg}`));
  }
};
