#!/bin/bash
set -e

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"
echo "Running consumer builds in $parent_path"

# Prepare 'sample-custom'
pushd samples/custom/dist
yarn unlink || true
yarn link
popd

# Prepare '@sample/material'
pushd samples/material/dist
yarn unlink || true
yarn link
popd

# Build ng cli app
pushd consumers/ng-cli
yarn install
yarn link sample-custom
yarn link @sample/material
yarn build:dev
yarn build:prod:jit
yarn build:prod:aot
popd



# node_modules/.bin/tsc -p integration/consumer-tsc/tsconfig.json --target es2015 --module es2015
# node_modules/.bin/tsc -p integration/consumer-tsc/tsconfig.json --target es5 --module es2015
# node_modules/.bin/tsc -p integration/consumer-tsc/tsconfig.json --target es5 --module umd
# node_modules/.bin/tsc -p integration/consumer-tsc/tsconfig.json --target es5 --module commonjs
