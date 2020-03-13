#!/bin/bash
set -e

FIND_COMMAND=""

if [[ $OSTYPE == "win32" ]]; then
    FIND_COMMAND="dir /b /o:n /ad"
else
    FIND_COMMAND="find ./integration/samples/* -maxdepth 0 -type d"
fi

for D in $FIND_COMMAND
do
    P_JS=${D}/ng-package.js
    P_JSON=${D}/ng-package.json
    P_API=${D}/ng-packagr-api.js
    P=${D}/package.json

    if [ -f $P_API ]; then
        echo "Building sample ${P_API}..."
        node ${P_API}
    elif [ -f $P_JS ]; then
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
