import { Transform, transformFromPromise } from '../../brocc/transform';
import { relocateSourceMaps } from '../../sourcemaps/relocate';
import * as log from '../../util/log';
import { isEntryPointInProgress, EntryPointNode } from '../nodes';
import { getGlobForMapWork } from '../../sourcemaps/shared';

export const relocateSourceMapsTransform: Transform = transformFromPromise(async graph => {
  const entryPoint = graph.find(isEntryPointInProgress()) as EntryPointNode;
  const moduleId = entryPoint.data.entryPoint.moduleId;

  // 4. SOURCEMAPS: RELOCATE ROOT PATHS
  log.info('Relocating source maps');

  const patterns = getGlobForMapWork(entryPoint.data.destinationFiles, true);
  await relocateSourceMaps(patterns, path => {
    let trimmedPath = path;
    // Trim leading '../' path separators
    while (trimmedPath.startsWith('../')) {
      trimmedPath = trimmedPath.substring(3);
    }

    return `ng://${moduleId}/${trimmedPath}`;
  });

  return graph;
});
