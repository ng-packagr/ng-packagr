#!/bin/bash
node dist/cli/ng-packagr.js -p integration/sample_core/ng-package.json
node dist/cli/ng-packagr.js -p integration/sample_custom/ng-package.json
node dist/cli/ng-packagr.js -p integration/sample_material/ng-package.json
