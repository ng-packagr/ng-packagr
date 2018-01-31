import { map, switchMap } from 'rxjs/operators';
import { of as observableOf } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { pipe } from 'rxjs/util/pipe';
import { BuildGraph } from '../../brocc/build-graph';
import { Node } from '../../brocc/node';
import { Transform } from '../../brocc/transform';
import { writeFlatBundleFiles, FlattenOpts } from '../../flatten/flatten';
import { byEntryPoint, isInProgress } from '../entry-point.node';
import { NgEntryPoint } from '../../ng-package-format/entry-point';

export const writeBundlesTransform: Transform = pipe(
  switchMap(graph => {
    const entryPoint = graph.find(byEntryPoint().and(isInProgress));
    const ngEntryPoint: NgEntryPoint = entryPoint.data.entryPoint;

    const opts: FlattenOpts = {
      entryFile: entryPoint.data.es2015EntryFile,
      outDir: entryPoint.data.stageDir,
      flatModuleFile: ngEntryPoint.flatModuleFile,
      esmModuleId: ngEntryPoint.moduleId,
      umdModuleId: ngEntryPoint.umdModuleId,
      umdModuleIds: ngEntryPoint.umdModuleIds,
      embedded: ngEntryPoint.embedded
    };

    return fromPromise(writeFlatBundleFiles(opts)).pipe(map(() => graph));
  })
);
