const path = require('path');

// Read CLI arguments
const ARGS = require('minimist')(process.argv.slice(2));

const SRC_DIR     = ARGS.src  || path.resolve(process.cwd());
const DEST_DIR    = ARGS.dest || path.resolve(SRC_DIR, 'dist');
const WORKING_DIR = ARGS.workingDirectory || path.resolve(SRC_DIR, '.ng_build');


// @see https://github.com/TypeStrong/ts-node#programmatic-usage
require('ts-node').register({
  project: path.join(__dirname, 'tsconfig.packagr.json')
});

const ngPackagr = require('./ng-packagr');

ngPackagr.packageAngular({
    src: SRC_DIR,
    dest: DEST_DIR,
    workingDirectory: WORKING_DIR
});
