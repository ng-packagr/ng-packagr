import { map, switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { pipe } from 'rxjs/util/pipe';
import { Transform } from '../../brocc/transform';
import { writeFlatBundleFiles, FlattenOpts } from '../../flatten/flatten';
import { NgEntryPoint } from '../../ng-package-format/entry-point';
import { isEntryPoint, isEntryPointInProgress } from '../nodes';

export const writeBundlesTransform: Transform = pipe(
  switchMap(graph => {
    const entryPoint = graph.find(isEntryPointInProgress());
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
      entryFile: entryPoint.data.es2015EntryFile,
      outDir: entryPoint.data.stageDir,
      flatModuleFile: ngEntryPoint.flatModuleFile,
      esmModuleId: ngEntryPoint.moduleId,
      umdModuleId: ngEntryPoint.umdId,
      amdId: ngEntryPoint.amdId,
      umdModuleIds: {
        ...ngEntryPoint.umdModuleIds,
        ...dependencyUmdIds
      },
      embedded: ngEntryPoint.embedded,
      comments: ngEntryPoint.comments,
      licensePath: ngEntryPoint.licensePath
    };

    return fromPromise(writeFlatBundleFiles(opts)).pipe(map(() => graph));
  })
);
