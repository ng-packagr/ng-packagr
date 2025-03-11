#!/bin/bash
set -e

cd "integration"
echo "Running consumer builds in $PWD"
pushd consumers/ng-cli

# Build ng cli app
pnpm -s install
pnpm -s build:dev --output-path dist/dev
pnpm -s build:prod:jit --output-path dist/jit
pnpm -s build:prod:aot --output-path dist/aot
popd
