import { Artefacts } from '../ng-package-format/artefacts';
import { NgEntryPoint } from '../ng-package-format/entry-point';
import { NgPackage } from '../ng-package-format/package';
import { copyFiles } from '../util/copy';
import * as path from 'path';

/**
 * Copies compiled source files from the intermediate working directory to the final locations
 * in the npm package's destination directory.
 */
export const copySourceFilesToDestination =
  async ({artefacts, entryPoint, pkg}: { artefacts: Artefacts, entryPoint: NgEntryPoint, pkg: NgPackage }): Promise<void> => {

    await copyFiles(`${artefacts.stageDir}/bundles/**/*.{js,js.map}`,
      path.resolve(pkg.dest, 'bundles'));
    await copyFiles(`${artefacts.stageDir}/esm5/**/*.{js,js.map}`,
      path.resolve(pkg.dest, 'esm5'))
    await copyFiles(`${artefacts.stageDir}/esm2015/**/*.{js,js.map}`,
      path.resolve(pkg.dest, 'esm2015'))
    await copyFiles(`${artefacts.outDir}/**/*.{d.ts,metadata.json}`,
      entryPoint.destinationPath);
  }
