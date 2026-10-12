#!/usr/bin/env node

import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { error, msg } from '../lib/utils/log';
import { build, execute, version as versionCommand } from '../public_api';

const DEFAULT_PROJECT_PATH = resolve(process.cwd(), 'ng-package.json');

const HELP = `ng-packagr [options]

Options:
  -v, --version   Prints version info
  -w, --watch     Watch for file changes
      --poll      Enable and define the file watching poll time period in milliseconds
  -p, --project   Path to the 'ng-package.json' or 'package.json' file. (default: ${DEFAULT_PROJECT_PATH})
  -c, --config    Path to a tsconfig file.
  -h, --help      Show this help message
`;

function parseCliArgs() {
  return parseArgs({
    options: {
      version: { type: 'boolean', short: 'v' },
      watch: { type: 'boolean', short: 'w' },
      poll: { type: 'string' },
      project: { type: 'string', short: 'p' },
      config: { type: 'string', short: 'c' },
      help: { type: 'boolean', short: 'h' },
    },
  }).values;
}

let values: ReturnType<typeof parseCliArgs>;
try {
  values = parseCliArgs();
} catch (err) {
  error((err as Error).message);
  msg(HELP);
  process.exit(1);
}

if (values.help) {
  msg(HELP);
} else if (values.version) {
  void versionCommand().then(() => process.exit(0));
} else {
  const config = values.config ? resolve(values.config) : undefined;
  const project = values.project || DEFAULT_PROJECT_PATH;
  const poll = values.poll !== undefined ? Number(values.poll) : undefined;

  execute(build, { config, project, watch: !!values.watch, poll }).catch(err => {
    error(err.message);
    process.exit(1);
  });
}
