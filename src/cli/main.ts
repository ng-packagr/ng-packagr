#! /usr/bin/env node

import * as program from 'commander';
import * as path from 'path';
import { createNgPackage, NgPackagrCliArguments } from './../lib/ng-packagr';

const DEFAULT_PROJECT_PATH = path.resolve(process.cwd(), 'ng-package.json');

function parseProjectPath(parsed: string): string {
  return parsed || DEFAULT_PROJECT_PATH;
}

program
  .name('ng-packagr')
  .option(
    '-p, --project <path>',
    'Path to the \'ng-package.json\' or \'package.json\' file.',
    parseProjectPath,
    DEFAULT_PROJECT_PATH)
  .parse(process.argv);

const cliArguments: any = program;

createNgPackage(cliArguments as NgPackagrCliArguments)
  .catch((err) => process.exit(111));
