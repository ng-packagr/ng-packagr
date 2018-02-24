import { map, switchMap } from 'rxjs/operators';
import { of as observableOf } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { pipe } from 'rxjs/util/pipe';
import { BuildGraph } from '../../brocc/build-graph';
import { Node } from '../../brocc/node';
import { Transform, transformFromPromise } from '../../brocc/transform';
import { writeFlatBundleFiles, FlattenOpts } from '../../flatten/flatten';
import { relocateSourceMaps } from '../../sourcemaps/relocate';
import * as log from '../../util/log';
import { isEntryPointInProgress } from '../nodes';

export const relocateSourceMapsTransform: Transform = transformFromPromise(async graph => {
  const entryPoint = graph.find(isEntryPointInProgress());
  const stageDir = entryPoint.data.stageDir;
  const moduleId = entryPoint.data.entryPoint.moduleId;

  // 4. SOURCEMAPS: RELOCATE ROOT PATHS
  log.info('Relocating source maps');
  const relocate = relocateSourceMaps(`${stageDir}/+(bundles|esm2015|esm5)/**/*.js.map`, path => {
    let trimmedPath = path;
    // Trim leading '../' path separators
    while (trimmedPath.startsWith('../')) {
      trimmedPath = trimmedPath.substring(3);
    }

    return `ng://${moduleId}/${trimmedPath}`;
  });

  return graph;
});
