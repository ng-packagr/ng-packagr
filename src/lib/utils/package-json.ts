import * as path from 'path';
import { NgEntryPoint } from '../ng-package/entry-point/entry-point';
import { EntryPointNode } from '../ng-package/nodes';
import * as log from './log';
import { ensureUnixPath } from './path';

export type PackageExports = Record<string, ConditionalExport | string>;

/**
 * Type describing the conditional exports descriptor for an entry-point.
 * https://nodejs.org/api/packages.html#packages_conditional_exports
 */
export type ConditionalExport = { types?: string; default?: string };

/**
 * Generates the `package.json` package exports following APF v13.
 * This is supposed to match with: https://github.com/angular/angular/blob/e0667efa6eada64d1fb8b143840689090fc82e52/packages/bazel/src/ng_package/packager.ts#L415.
 */
export function generatePackageExports(
  { destinationPath, packageJson }: NgEntryPoint,
  entryPoints: EntryPointNode[],
): PackageExports {
  const exports: PackageExports = packageJson.exports ? JSON.parse(JSON.stringify(packageJson.exports)) : {};

  const insertMappingOrError = (subpath: string, mapping: ConditionalExport) => {
    exports[subpath] ??= {};

    if (typeof exports[subpath] === 'string') {
      log.warn(
        `Found an existing subpath export for "${subpath}". The export would be overridden by ng-packagr. Please unset it.`,
      );
      exports[subpath] = {};
    }
    const subpathExport = exports[subpath];

    // Go through all conditions that should be inserted. If the condition is already
    // manually set of the subpath export, we throw an error. In general, we allow for
    // additional conditions to be set. These will always precede the generated ones.
    for (const conditionName of Object.keys(mapping)) {
      if (subpathExport[conditionName] !== undefined) {
        log.warn(
          `Found a conflicting export condition for "${subpath}". The "${conditionName}" ` +
            `condition would be overridden by ng-packagr. Please unset it.`,
        );
        // Must delete existing subpath export to ensure that order matches mapping
        delete subpathExport[conditionName];
      }

      // **Note**: The order of the conditions is preserved even though we are setting
      // the conditions once at a time (the latest assignment will be at the end).
      subpathExport[conditionName] = mapping[conditionName];
    }
  };

  const relativeUnixFromDestPath = (filePath: string) =>
    './' + ensureUnixPath(path.relative(destinationPath, filePath));

  insertMappingOrError('./package.json', { default: './package.json' });

  const entryPointsSorted = entryPoints.sort((a, b) => a.url.localeCompare(b.url));
  for (const entryPoint of entryPointsSorted) {
    const { destinationFiles, isSecondaryEntryPoint } = entryPoint.data.entryPoint;
    const subpath = isSecondaryEntryPoint ? `./${destinationFiles.directory}` : '.';

    insertMappingOrError(subpath, {
      types: relativeUnixFromDestPath(destinationFiles.declarationsBundled),
      default: relativeUnixFromDestPath(destinationFiles.fesm2022),
    });
  }

  return exports;
}

/**
 * Generates a new version for the package `package.json` when runing in watch mode.
 */
export function generateWatchVersion() {
  return `0.0.0-watch+${Date.now()}`;
}
