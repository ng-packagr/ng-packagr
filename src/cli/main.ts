#!/usr/bin/env node

import * as program from 'commander';
import * as path from 'path';
import { execute } from '../lib/commands/command';
import { build } from '../lib/commands/build.command';
import { version } from '../lib/commands/version.command';

const DEFAULT_PROJECT_PATH = path.resolve(process.cwd(), 'ng-package.json');

function parseProjectPath(parsed: string): string {
  return parsed || DEFAULT_PROJECT_PATH;
}

program
  .name('ng-packagr')
  .option(
    '-V, --version',
    'Prints version info')
  .option(
    '-p, --project [path]',
    'Path to the \'ng-package.json\' or \'package.json\' file.',
    parseProjectPath,
    DEFAULT_PROJECT_PATH)

program.on('option:version', () => {
  version();
  process.exit(0);
});

program
  .parse(process.argv);

execute(build, { project: program.opts().project })
  .catch((err) => process.exit(111));
