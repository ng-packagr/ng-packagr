#!/usr/bin/env node

import { resolve } from 'node:path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { error } from '../lib/utils/log';
import { build, execute, version as versionCommand } from '../public_api';

const DEFAULT_PROJECT_PATH = resolve(process.cwd(), 'ng-package.json');

const argv = yargs(hideBin(process.argv))
  .scriptName('ng-packagr')
  .usage('$0 [options]')
  // Disable built-in version/help behaviors to match your custom logic
  .version(false)
  .help(false)
  .options({
    version: {
      alias: 'v',
      type: 'boolean',
      description: 'Prints version info',
    },
    watch: {
      alias: 'w',
      type: 'boolean',
      description: 'Watch for file changes',
    },
    poll: {
      type: 'number',
      description: 'Enable and define the file watching poll time period in milliseconds',
    },
    project: {
      alias: 'p',
      type: 'string',
      description: "Path to the 'ng-package.json' or 'package.json' file.",
      default: DEFAULT_PROJECT_PATH,
    },
    config: {
      alias: 'c',
      type: 'string',
      description: 'Path to a tsconfig file.',
    },
  })
  // Handle path resolutions and number parsing cleanly via coerce
  .coerce({
    poll: val => Number(val),
    project: val => val || DEFAULT_PROJECT_PATH,
    config: val => (val ? resolve(val) : undefined),
  })
  .parseSync();

// Custom version flag execution
if (argv.version) {
  void versionCommand().then(() => process.exit(0));
} else {
  const { config, project, watch, poll } = argv;

  execute(build, { config, project, watch: !!watch, poll }).catch(err => {
    error(err.message);
    process.exit(1);
  });
}
