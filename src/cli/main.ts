#! /usr/bin/env node
import * as program from 'commander';
import * as path from 'path';
import { createNgPackage, CliArguments } from '../lib/ng-packagr';

const DEFAULT_PROJECT_PATH = process.cwd();

function parseProjectPath(parsed: string): string {
  return parsed || DEFAULT_PROJECT_PATH;
}

program
  .name('ng-packagr')
  .option(
    '-p, --project <path>',
    'Path to the \'package.json\' or \'ng-package.json\' or \'ng-package.js\' file.',
    parseProjectPath,
    DEFAULT_PROJECT_PATH)
  .parse(process.argv);

createNgPackage((program as any) as CliArguments)
  .catch((err) => process.exit(111));
