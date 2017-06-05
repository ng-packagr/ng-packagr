#!/bin/bash
cd integration/sample_custom
yarn unlink
yarn link
cd ../..

cd integration/consumer-ng-cli
yarn link sample-custom
yarn install
yarn build:dev
yarn build:prod:jit
yarn build:prod:aot
cd ../..

node_modules/.bin/tsc -p integration/consumer-tsc/tsconfig.json --target es2015 --module es2015
node_modules/.bin/tsc -p integration/consumer-tsc/tsconfig.json --target es5 --module es2015
node_modules/.bin/tsc -p integration/consumer-tsc/tsconfig.json --target es5 --module umd
node_modules/.bin/tsc -p integration/consumer-tsc/tsconfig.json --target es5 --module commonjs
