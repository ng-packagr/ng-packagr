const ngPackage = require('../../../dist/public_api');
const path = require('path');

ngPackage
  .ngPackagr()
  .forProject(path.join(__dirname, 'ng-packagr-config.js'))
  .withTsConfig(path.join(__dirname, 'tsconfig.ngc.json'))
  .build()
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
