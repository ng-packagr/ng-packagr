#!/bin/bash
set -e

cd "integration"
echo "Running consumer builds in $PWD"
pushd consumers/ng-cli

# Build ng cli app
pnpm --silent install
pnpm --silent build:dev --output-path dist/dev
pnpm --silent build:prod:jit --output-path dist/jit
pnpm --silent build:prod:aot --output-path dist/aot
popd
