const copyfiles = require('copyfiles');

const copy = (paths, opts) => {

  return new Promise((resolve, reject) => {

    copyfiles(paths, opts || {}, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// copyfiles 'cli/*' dist
// copyfiles -f 'lib/ng-package.schema.json' dist
// copyfiles 'lib/conf/**/*.json' dist",

copy(['cli/*', 'dist'])
  .then(() => copy(['lib/ng-package.schema.json', 'dist'], {up: true}))
  .then(() => copy(['lib/conf/**/*.json', 'dist']))
  .catch((err) => {
    console.error("Cannot copy files", err);
    process.exit(1);
  });
