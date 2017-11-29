#!/bin/bash
set -e

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"
echo "Running consumer builds in $parent_path"

# Link a library
link(){
   # libPath stores $1 argument passed to link()
   libPath=$1
   echo "Prepare '$libPath'"
   pushd $libPath
   # never fail unlink for the case where nothing has been linked before
   yarn unlink || true
   yarn link
   popd
}

link samples/custom/dist
link samples/material/dist

echo "Build ng cli app"
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
