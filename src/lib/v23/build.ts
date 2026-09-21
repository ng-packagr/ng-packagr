import { ParsedConfiguration } from "@angular/compiler-cli";
import { BuildGraph } from "../graph/build-graph";
import { STATE_PENDING } from "../graph/node";
import { discoverPackages } from '../ng-package/discover-packages';
import { analyseSourcesTransform2 } from "../ng-package/entry-point/analyse-sources.transform";
import { compileNgcTransformFactory2 } from "../ng-package/entry-point/compile-ngc.transform";
import { entryPointTransformFactory2 } from "../ng-package/entry-point/entry-point.transform";
import { initTsConfigTransformFactory2 } from "../ng-package/entry-point/init-tsconfig.transform";
import { writeBundlesTransform2 } from "../ng-package/entry-point/write-bundles.transform";
import { writePackageTansform2 } from "../ng-package/entry-point/write-package.transform";
import { EntryPointNode, PackageNode, ngUrl } from '../ng-package/nodes';
import { NgPackagrOptions, normalizeOptions } from "../ng-package/options";
import { buildTransformFactory2 } from "../ng-package/package.transform";
import { StylesheetProcessor } from '../styles/stylesheet-processor';
import { shutdownSassWorkerPool } from "../styles/stylesheets/sass-language";
import { rmdir } from '../utils/fs';
import log from '../utils/log';

export async function buildNgPackage(
  options: NgPackagrOptions,
  project: string,
  tsConfig: ParsedConfiguration | string | undefined
): Promise<void> {
  log.info(`Building Angular Package`);

  // Normalize options
  const normalizedOptions = normalizeOptions(options);

  // XX: migrated from package.transform.ts
  const pkgUri = ngUrl(project);
  const ngPkg = new PackageNode(pkgUri);
  const graph = new BuildGraph();

  ngPkg.data = await discoverPackages({ project });
  graph.put(ngPkg);
  const { dest, deleteDestPath } = ngPkg.data;

  if (deleteDestPath) {
    try {
      await rmdir(dest, { recursive: true });
    } catch {}
  }

  const entryPoints = [ngPkg.data.primary, ...ngPkg.data.secondaries].map(entryPoint => {
    const { destinationFiles, moduleId } = entryPoint;
    const node = new EntryPointNode(
      ngUrl(moduleId),
      ngPkg.cache.sourcesFileCache,
      ngPkg.cache.moduleResolutionCache,
    );
    node.data = { entryPoint, destinationFiles };
    node.state = STATE_PENDING;
    ngPkg.dependsOn(node);

    return node;
  });

  // Add entry points to graph
  graph.put(entryPoints);

  const initTs = initTsConfigTransformFactory2(tsConfig);
  await initTs(graph);

  // XX: migrated from package.transform.ts
  const buildTransform = buildTransformFactory2(
    project,
    normalizedOptions,
    analyseSourcesTransform2,
    entryPointTransformFactory2(
      compileNgcTransformFactory2(StylesheetProcessor, normalizedOptions),
      writeBundlesTransform2(normalizedOptions),
      writePackageTansform2(normalizedOptions)
    )
  );

  try {
    await buildTransform(graph);
  } finally {
    for (const node of ngPkg.dependents) {
      if (node instanceof EntryPointNode) {
        node.cache?.stylesheetProcessor?.destroy();
      }
    }
    shutdownSassWorkerPool();    
  }
}
