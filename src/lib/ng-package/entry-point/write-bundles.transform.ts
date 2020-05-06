import { Transform, transformFromPromise } from '../../graph/transform';
import { NgEntryPoint } from './entry-point';
import { isEntryPoint, isEntryPointInProgress, EntryPointNode } from '../nodes';
import * as log from '../../utils/log';
import { BuildGraph } from '../../graph/build-graph';
import { DependencyList } from '../../flatten/external-module-id-strategy';
import { unique } from '../../utils/array';
import { downlevelCodeWithTsc } from '../../flatten/downlevel-plugin';
import { rollupBundleFile } from '../../flatten/rollup';
import { minifyJsFile } from '../../flatten/uglify';

export const writeBundlesTransform: Transform = transformFromPromise(async (graph) => {
  const entryPoint = graph.find(isEntryPointInProgress()) as EntryPointNode;
  const { destinationFiles, entryPoint: ngEntryPoint, tsConfig } = entryPoint.data;

  // Add UMD module IDs for dependencies
  const dependencyUmdIds = entryPoint
    .filter(isEntryPoint)
    .map((ep) => ep.data.entryPoint)
    .reduce((prev, ep: NgEntryPoint) => {
      prev[ep.moduleId] = ep.umdId;

      return prev;
    }, {});

  const { fesm2015, esm2015, umd, umdMinified } = destinationFiles;

  const opts = {
    sourceRoot: tsConfig.options.sourceRoot,
    amd: { id: ngEntryPoint.amdId },
    umdModuleIds: {
      ...ngEntryPoint.umdModuleIds,
      ...dependencyUmdIds,
    },
    entry: esm2015,
    dependencyList: getDependencyListForGraph(graph),
  };

  log.info('Bundling to FESM2015');
  await rollupBundleFile({
    ...opts,
    moduleName: ngEntryPoint.moduleId,
    format: 'es',
    dest: fesm2015,
  });

  log.info('Bundling to UMD');
  await rollupBundleFile({
    ...opts,
    moduleName: ngEntryPoint.umdId,
    entry: esm2015,
    format: 'umd',
    dest: umd,
    transform: downlevelCodeWithTsc,
  });

  log.info('Minifying UMD bundle');
  await minifyJsFile(umd, umdMinified);
});

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
