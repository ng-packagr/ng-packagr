import chalk from 'chalk';

export const error = (err: string | Error) => {
  if (err instanceof Error) {
    console.log('\n' + chalk.red('BUILD ERROR'));
    console.log(chalk.red(err.message));
    console.log(chalk.red(err.stack) + '\n');
  } else {
    console.log(chalk.red(err));
  }
};

export const warn = (msg: string) => {
  console.log(chalk.yellow(msg));
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
