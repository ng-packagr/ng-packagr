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

copy(['src/cli/*', 'dist'], {up: 1})
  .then(() => copy(['src/**.schema.json', 'dist'], {up: 1}))
  .then(() => copy(['src/lib/conf/**/*.json', 'dist'], {up: 1}))
  .catch((err) => {
    console.error("Cannot copy files", err);
    process.exit(1);
  });
