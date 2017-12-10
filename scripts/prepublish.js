#!/usr/bin/env node
const cpx = require('cpx');
const fs = require('fs');

cpx.copy('LICENSE', 'dist');
cpx.copy('README.md', 'dist');
cpx.copy('CHANGELOG.md', 'dist');
cpx.copy('sample/**/*', 'dist/sample');

const packageJson = JSON.parse(fs.readFileSync('package.json'));
delete packageJson['devDependencies'];
delete packageJson['scripts'];
delete packageJson['private'];
fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, undefined, 2));
