#!/bin/bash
set -e

cd "integration"
echo "Running consumer builds in $PWD"
# Prepare samples
array=( 'custom' 'material' 'secondary' )
for sample in "${array[@]}"; do
    pushd "samples/${sample}/dist"
    yarn unlink || true
    yarn link
    popd
done

# Build ng cli app
pushd consumers/ng-cli
yarn install
yarn link sample-custom
yarn link @sample/material
yarn link @sample/secondary
yarn build:dev --output-path dist/dev
yarn build:prod:jit --output-path dist/jit
yarn build:prod:aot --output-path dist/aot
popd
