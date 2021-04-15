#!/bin/sh
# NOTE: When making changes, make sure to run the script through ShellCheck!
# @see https://github.com/koalaman/shellcheck

# Exit script on error.
set -o errexit
# Disable pathname expansion.
set -o noglob
# Error on unset (non-special) parameter expansion.
set -o nounset

DIR_NAME_LIST=""
if [ "${OSTYPE:-}" = "win32" ]; then
    DIR_NAME_LIST=$(dir /b /o:n /ad "integration/samples/")
else
    DIR_NAME_LIST=$(ls integration/samples)
fi
printf "Processing integration/samples:\n%s" "${DIR_NAME_LIST}"
PACKAGE_FILE_CANDIDATES="ng-packagr-api.js  ng-package.js  ng-package.json  package.json"

for DIR_NAME in $DIR_NAME_LIST; do
    PACKAGE_PATH="integration/samples/${DIR_NAME}"
    printf "\n\nProcessing integration sample: %s\n" "${PACKAGE_PATH}"

    PACKAGE_FILE_NAME=""
    for FILE in $PACKAGE_FILE_CANDIDATES; do
        if [ -f "${PACKAGE_PATH}/${FILE}" ]; then
            PACKAGE_FILE_NAME="${FILE}"
            break;
        fi
    done

    if [ -n "${PACKAGE_FILE_NAME}" ]; then
        printf "Found ng-packagr file: %s\n" "${PACKAGE_FILE_NAME}"
    else
        printf "No package found in directory, skipping: %s\n" "${PACKAGE_PATH}"
        continue;
    fi

    # All integration samples starting with "fail" are expected to fail.
    EXPECTED_TO_FAIL=false
    case "${DIR_NAME}" in
        "fail"*)
            printf "NOTE: This next package build is expected to fail!\n"
            EXPECTED_TO_FAIL=true
            ;;
    esac

    if [ "${PACKAGE_FILE_NAME}" = "ng-packagr-api.js" ]; then
        node "${PACKAGE_PATH}/${PACKAGE_FILE_NAME}"
    elif $EXPECTED_TO_FAIL; then
        if node dist/cli/main.js -p "${PACKAGE_PATH}/${PACKAGE_FILE_NAME}"; then
          printf "ERROR: Package build was expected to fail!\n"
          exit 1
        fi
    else
        node dist/cli/main.js -p "${PACKAGE_PATH}/${PACKAGE_FILE_NAME}"
    fi

    printf "Finished processing: %s!\n" "${PACKAGE_PATH}"
done

printf "Finished processing all integration samples!\n"
