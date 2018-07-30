#!/usr/bin/env node

import * as program from 'commander';
import * as path from 'path';
import * as updateNotifier from 'update-notifier';
import * as readPkgUp from 'read-pkg-up';
import { execute, build, version } from '../public_api';

const DEFAULT_PROJECT_PATH = path.resolve(process.cwd(), 'ng-package.json');

function parseProjectPath(parsed: string): string {
  return parsed || DEFAULT_PROJECT_PATH;
}

program
  .name('ng-packagr')
  .option('-V, --version', 'Prints version info')
  .option('-w, --watch', 'Watch for file changes')
  .option(
    '-p, --project [path]',
    "Path to the 'ng-package.json' or 'package.json' file.",
    parseProjectPath,
    DEFAULT_PROJECT_PATH
  );

const dir = path.dirname(module.filename);
const pkg = readPkgUp.sync({ cwd: dir }).pkg;
updateNotifier({ pkg }).notify();

program.on('option:version', () => {
  version(pkg);
  process.exit(0);
});

program.parse(process.argv);

execute(build, { project: program.opts().project, watch: !!program.opts().watch }).catch(() => process.exit(111));
