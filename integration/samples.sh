#!/bin/bash
set -e

for D in `find ./integration/samples/* -maxdepth 0 -type d`
do
    P_JS=${D}/ng-package.js
    P_JSON=${D}/ng-package.json
    P=${D}/package.json

    if [ -f $P_JS ]; then
        echo "Building sample ${P_JS}..."
        node dist/cli/main.js -p ${P_JS}
    elif [ -f $P_JSON ]; then
        echo "Building sample ${P_JSON}..."
        node dist/cli/main.js -p ${P_JSON}
    elif [ -f $P ]; then
        echo "Building sample ${P}..."
        if [ $P='failures' ]; then
            node dist/cli/main.js -p ${P} || true
        else
            node dist/cli/main.js -p ${P}
        fi
    fi
    echo "Built."
done
