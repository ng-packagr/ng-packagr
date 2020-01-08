#!/bin/bash
set -e

cd "integration"
echo "Running consumer builds in $PWD"
# Prepare samples
dists=( 'custom/dist' 'material/dist' 'secondary/dist' 'library/dist/library' )
for sample in "${dists[@]}"; do
    pushd "samples/${sample}"
    yarn unlink || true
    yarn link
    popd
done

# Build ng cli app
pushd consumers/ng-cli
yarn install
yarn link sample-custom
yarn link library
yarn link @sample/material
yarn link @sample/secondary
yarn build:dev --output-path dist/dev
yarn build:prod:jit --output-path dist/jit
yarn build:prod:aot --output-path dist/aot
popd


# Plain typescript consumer
pushd consumers/tsc
../../../node_modules/.bin/tsc -p tsconfig.json
# node_modules/.bin/tsc -p tsconfig.json --target es2015 --module es2015
# node_modules/.bin/tsc -p tsconfig.json --target es5 --module es2015
# node_modules/.bin/tsc -p tsconfig.json --target es5 --module umd
# node_modules/.bin/tsc -p tsconfig.json --target es5 --module commonjs
popd
