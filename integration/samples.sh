#!/bin/bash
for D in `find ./integration/samples/* -maxdepth 0 -type d`
do
    node dist/cli/main.js -p ${D}/ng-package.json
done
