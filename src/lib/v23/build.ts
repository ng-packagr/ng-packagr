import { ParsedConfiguration } from "@angular/compiler-cli";
import { NgPackagrOptions, normalizeOptions } from "../ng-package/options";
import { initTsConfigTransformFactory2 } from "../ng-package/entry-point/init-tsconfig.transform";
import log from '../utils/log';
import { EntryPointNode, PackageNode, ngUrl } from '../ng-package/nodes';
import { BuildGraph } from "../graph/build-graph";
import { STATE_PENDING } from "../graph/node";
import { analyseSourcesTransform2 } from "../ng-package/entry-point/analyse-sources.transform";
import { entryPointTransformFactory2 } from "../ng-package/entry-point/entry-point.transform";
import { rmdir } from '../utils/fs';
import { discoverPackages } from '../ng-package/discover-packages';
import { compileNgcTransformFactory2 } from "../ng-package/entry-point/compile-ngc.transform";
import { StylesheetProcessor } from '../styles/stylesheet-processor';
import { writeBundlesTransform2 } from "../ng-package/entry-point/write-bundles.transform";
import { writePackageTansform2 } from "../ng-package/entry-point/write-package.transform";
import { buildTransformFactory2 } from "../ng-package/package.transform";

export async function buildNgPackage(
  options: NgPackagrOptions,
  project: string,
  tsConfig: ParsedConfiguration | string | undefined
): Promise<void> {
  log.info(`Building Angular Package`);

  const normalizedOptions = normalizeOptions(options);
  console.log("options", normalizedOptions);
  console.log("project", project);

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
  initTs(graph);

  console.log("graph...", graph);

  // XX: migrated from package.transform.ts
  const compileNgc = compileNgcTransformFactory2(StylesheetProcessor, normalizedOptions)
  const writeBundles = writeBundlesTransform2(normalizedOptions);
  const writePackages = writePackageTansform2(normalizedOptions);
  const entryPointTransform = entryPointTransformFactory2(compileNgc, writeBundles, writePackages);
  const buildTransform = buildTransformFactory2(project, normalizedOptions, analyseSourcesTransform2, entryPointTransform);

  buildTransform(graph);
}
