#!/bin/bash
for D in `find ./integration/samples/* -maxdepth 0 -type d`
do
    node dist/cli/ng-packagr.js -p ${D}/ng-package.json
done
