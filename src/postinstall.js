#!/usr/bin/env node

if (process.env.CI) {
  process.exit(0);
}

var spawnSync = require('child_process').spawnSync;

var result = spawnSync('node_modules/.bin/opencollective', ['postinstall'], {
  cwd: process.cwd(),
  stdio: 'inherit'
});

process.exit(result.status);
