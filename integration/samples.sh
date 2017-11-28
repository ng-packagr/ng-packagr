#!/bin/bash
set -e

for D in `find ./integration/samples/* -maxdepth 0 -type d`
do
    P=${D}/ng-package.json
    if [ -f $P ]; then
        echo "Building sample ${P}..."
        node dist/cli/main.js -p ${P}
    else
        P=${D}/package.json
        echo "Building sample ${P}..."
        node dist/cli/main.js -p ${P}
    fi
    echo "Built."
done
