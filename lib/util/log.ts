const chalk = require('chalk');

export const error = (msg: string) => {
  console.log(chalk.red(msg));
}

export const warn = (msg: string) => {
  console.log(chalk.yellow(msg));
}

export const success = (msg: string) => {
  console.log(chalk.green(msg));
}

export const info = (msg: string) => {
  console.log(chalk.blue(msg));
}

export const debug = (msg: string) => {

  if (process.env.DEBUG) {
    console.log(chalk.inverse.cyan(msg));
    console.log('\n');
  }

}
