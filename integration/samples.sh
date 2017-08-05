#!/bin/bash
node dist/cli/ng-packagr.js -p integration/samples/core/ng-package.json
node dist/cli/ng-packagr.js -p integration/samples/custom/ng-package.json
node dist/cli/ng-packagr.js -p integration/samples/material/ng-package.json
node dist/cli/ng-packagr.js -p integration/samples/rxjs/ng-package.json
node dist/cli/ng-packagr.js -p integration/samples/typings/ng-package.json
