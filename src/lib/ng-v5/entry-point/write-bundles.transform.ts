import { map, switchMap } from 'rxjs/operators';
import { from as fromPromise, pipe } from 'rxjs';
import { Transform } from '../../brocc/transform';
import { FlattenOpts, flattenToFesm, flattenToUmd, flattenToUmdMin } from '../../flatten/flatten';
import { NgEntryPoint } from '../../ng-package-format/entry-point';
import { isEntryPoint, isEntryPointInProgress, EntryPointNode } from '../nodes';
import * as log from '../../util/log';
import { DestinationFiles } from '../../ng-package-format/shared';
import { BuildGraph } from '../../brocc/build-graph';
import { DependencyList } from '../../flatten/external-module-id-strategy';
import { unique } from '../../util/array';

export const writeBundlesTransform: Transform = pipe(
  switchMap(graph => {
    const entryPoint = graph.find(isEntryPointInProgress()) as EntryPointNode;
    const { destinationFiles, entryPoint: ngEntryPoint, tsConfig } = entryPoint.data;

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
      sourceRoot: tsConfig.options.sourceRoot,
      flatModuleFile: ngEntryPoint.flatModuleFile,
      esmModuleId: ngEntryPoint.moduleId,
      umdModuleId: ngEntryPoint.umdId,
      amdId: ngEntryPoint.amdId,
      umdModuleIds: {
        ...ngEntryPoint.umdModuleIds,
        ...dependencyUmdIds,
      },
      dependencyList: getDependencyListForGraph(graph),
    };

    return fromPromise(writeFlatBundleFiles(destinationFiles, opts)).pipe(map(() => graph));
  }),
);

async function writeFlatBundleFiles(destinationFiles: DestinationFiles, opts: FlattenOpts): Promise<void> {
  const { esm2015, fesm2015, esm5, fesm5, umd, umdMinified } = destinationFiles;

  log.info('Bundling to FESM2015');
  await flattenToFesm({
    ...opts,
    entryFile: esm2015,
    destFile: fesm2015,
  });

  log.info('Bundling to FESM5');
  await flattenToFesm({
    ...opts,
    entryFile: esm5,
    destFile: fesm5,
  });

  log.info('Bundling to UMD');
  await flattenToUmd({
    ...opts,
    entryFile: fesm5,
    destFile: umd,
    dependencyList: opts.dependencyList,
  });

  log.info('Minifying UMD bundle');
  await flattenToUmdMin(umd, umdMinified);
}

/** Get all list of dependencies for the entire 'BuildGraph' */
function getDependencyListForGraph(graph: BuildGraph): DependencyList {
  // We need to do this because if A dependecy on bundled B
  // And A has a secondary entry point A/1 we want only to bundle B if it's used.
  // Also if A/1 depends on A we don't want to bundle A thus we mark this a dependency.

  const dependencyList: DependencyList = {
    dependencies: [],
    bundledDependencies: [],
  };

  for (const entry of graph.filter(isEntryPoint)) {
    const { bundledDependencies = [], dependencies = {}, peerDependencies = {} } = entry.data.entryPoint.packageJson;
    dependencyList.bundledDependencies = unique(dependencyList.bundledDependencies.concat(bundledDependencies));
    dependencyList.dependencies = unique(
      dependencyList.dependencies.concat(
        Object.keys(dependencies),
        Object.keys(peerDependencies),
        entry.data.entryPoint.moduleId,
      ),
    );
  }

  if (dependencyList.bundledDependencies.length) {
    log.warn(
      `Inlining of 'bundledDependencies' has been deprecated in version 5 and will be removed in future versions.` +
        '\n' +
        `List the depedency in the 'peerDependencies' section instead.`,
    );
  }

  return dependencyList;
}
