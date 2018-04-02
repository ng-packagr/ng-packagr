import { map, switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { pipe } from 'rxjs/util/pipe';
import { Transform } from '../../brocc/transform';
import { FlattenOpts, flattenToFesm, flattenToUmd, flattenToUmdMin } from '../../flatten/flatten';
import { NgEntryPoint } from '../../ng-package-format/entry-point';
import { isEntryPoint, isEntryPointInProgress, EntryPointNode } from '../nodes';
import * as log from '../../util/log';
import { DestinationFiles } from '../../ng-package-format/shared';

export const writeBundlesTransform: Transform = pipe(
  switchMap(graph => {
    const entryPoint = graph.find(isEntryPointInProgress()) as EntryPointNode;
    const ngEntryPoint: NgEntryPoint = entryPoint.data.entryPoint;

    // Add UMD module IDs for dependencies
    const dependencyUmdIds = entryPoint
      .filter(isEntryPoint)
      .map(ep => ep.data.entryPoint)
      .reduce((prev, ep: NgEntryPoint) => {
        prev[ep.moduleId] = ep.umdId;

        return prev;
      }, {});

    const opts: FlattenOpts = {
      destFile: '',
      entryFile: '',
      flatModuleFile: ngEntryPoint.flatModuleFile,
      esmModuleId: ngEntryPoint.moduleId,
      umdModuleId: ngEntryPoint.umdId,
      amdId: ngEntryPoint.amdId,
      umdModuleIds: {
        ...ngEntryPoint.umdModuleIds,
        ...dependencyUmdIds
      }
    };

    const { destinationFiles } = entryPoint.data;
    return fromPromise(writeFlatBundleFiles(destinationFiles, opts)).pipe(map(() => graph));
  })
);

async function writeFlatBundleFiles(destinationFiles: DestinationFiles, opts: FlattenOpts): Promise<void> {
  const { esm2015, fesm2015, esm5, fesm5, umd, umdMinified } = destinationFiles;

  log.info('Bundling to FESM2015');
  await flattenToFesm({
    ...opts,
    entryFile: esm2015,
    destFile: fesm2015
  });

  log.info('Bundling to FESM5');
  await flattenToFesm({
    ...opts,
    entryFile: esm5,
    destFile: fesm5
  });

  log.info('Bundling to UMD');
  await flattenToUmd({
    ...opts,
    entryFile: fesm5,
    destFile: umd
  });

  log.info('Minifying UMD bundle');
  await flattenToUmdMin(umd, umdMinified);
}
