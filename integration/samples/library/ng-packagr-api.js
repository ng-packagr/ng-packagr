const ngPackage = require('../../../dist/public_api');
const path = require('path');

ngPackage
  .ngPackagr()
  .forProject(path.join(__dirname, 'projects/library/ng-package.json'))
  .withTsConfig(path.join(__dirname, 'projects/library/tsconfig.lib.json'))
  .build()
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
