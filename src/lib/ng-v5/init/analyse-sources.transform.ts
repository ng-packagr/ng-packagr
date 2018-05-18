import * as ng from '@angular/compiler-cli';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import * as log from '../../util/log';
import { Transform } from '../../brocc/transform';
import { isEntryPoint, isPackage, PackageNode, EntryPointNode } from '../nodes';
import { cacheCompilerHost } from '../../ts/cache-compiler-host';

export const analyseSourcesTransform: Transform = pipe(
  map(graph => {
    const entryPoints = graph.filter(isEntryPoint);
    const ngPkg = graph.find(isPackage) as PackageNode;
    const { moduleResolutionCache } = ngPkg;

    const analyseEntryPoint = (entryPoint: EntryPointNode) => {
      const { tsConfig } = entryPoint.data;
      const { analysisFileCache, resourcesFileCache } = entryPoint.cache;
      const { moduleId } = entryPoint.data.entryPoint;
      log.debug(`Analysing sources for ${moduleId}`);

      let compilerHost = cacheCompilerHost(
        tsConfig.options,
        analysisFileCache,
        resourcesFileCache,
        moduleResolutionCache
      );

      const { moduleNameToFileName, readResource } = compilerHost;

      compilerHost = {
        ...compilerHost,
        moduleNameToFileName: (moduleName: string, containingFile: string) => {
          const resolvedModule: string = moduleNameToFileName.call(this, moduleName, containingFile);
          let dep = entryPoints.find(ep => ep.data.entryPoint.moduleId === moduleName);

          if (dep) {
            log.debug(
              `Found entry point dependency: ${entryPoint.data.entryPoint.moduleId} -> ${dep.data.entryPoint.moduleId}`
            );
            entryPoint.dependsOn(dep);
          }

          return resolvedModule;
        },
        readResource: (fileName: string) => {
          readResource.call(this, fileName);
          return '';
        }
      };

      const program: ng.Program = ng.createProgram({
        rootNames: tsConfig.rootNames,
        options: tsConfig.options,
        host: compilerHost
      });

      const diagnostics = program.getNgStructuralDiagnostics();
      if (diagnostics.length) {
        throw new Error(ng.formatDiagnostics(diagnostics));
      }
    };

    entryPoints.forEach(analyseEntryPoint);
    return graph;
  })
);
