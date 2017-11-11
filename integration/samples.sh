#!/bin/bash
for D in `find ./integration/samples/* -maxdepth 0 -type d`
do
  if [ -f ${D}/ng-package.json ]; then
    node dist/cli/main.js -p ${D}/ng-package.json
  else
    node dist/cli/main.js -p ${D}/package.json
  fi
done
