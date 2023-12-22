const { readFileSync, copyFileSync, writeFileSync, constants, mkdirSync } = require('fs');

copyFileSync('LICENSE', 'dist/LICENSE', constants.COPYFILE_FICLONE);
copyFileSync('README.md', 'dist/README.md', constants.COPYFILE_FICLONE);
copyFileSync('src/ng-package.schema.json', 'dist/ng-package.schema.json', constants.COPYFILE_FICLONE);
copyFileSync('src/ng-entrypoint.schema.json', 'dist/ng-entrypoint.schema.json', constants.COPYFILE_FICLONE);

mkdirSync('dist/lib/ts/conf', { recursive: true });
copyFileSync('src/lib/ts/conf/tsconfig.ngc.json', 'dist/lib/ts/conf/tsconfig.ngc.json', constants.COPYFILE_FICLONE);

const packageJson = JSON.parse(readFileSync('package.json'));
delete packageJson['devDependencies'];
delete packageJson['scripts'];
delete packageJson['private'];
delete packageJson['husky'];
writeFileSync('dist/package.json', JSON.stringify(packageJson, undefined, 2));
