import * as ng from '@angular/compiler-cli';
import * as ts from 'typescript';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import * as log from '../../util/log';
import { Transform } from '../../brocc/transform';
import { isEntryPoint, isPackage, EntryPointNode } from '../nodes';
import { cacheCompilerHost } from '../../ts/cache-compiler-host';
import { unique, flatten } from '../../util/array';

export const analyseSourcesTransform: Transform = pipe(
  map(graph => {
    const entryPoints = graph.filter(isEntryPoint);

    const analyseEntryPoint = (entryPoint: EntryPointNode) => {
      const { tsConfig } = entryPoint.data;
      const { analysisFileCache, analysisModuleResolutionCache } = entryPoint.cache;
      const { moduleId } = entryPoint.data.entryPoint;
      log.debug(`Analysing sources for ${moduleId}`);

      let compilerHost = cacheCompilerHost(tsConfig.options, analysisFileCache, analysisModuleResolutionCache);

      const { readResource } = compilerHost;

      compilerHost = {
        ...compilerHost,
        readResource: () => ''
      };

      const program: ng.Program = ng.createProgram({
        rootNames: tsConfig.rootNames,
        options: tsConfig.options,
        host: compilerHost
      });

      const diagnostics = program.getNgSemanticDiagnostics();
      if (diagnostics.length) {
        throw new Error(ng.formatDiagnostics(diagnostics));
      }

      // this is a workaround due to the above
      // https://github.com/angular/angular/issues/24010
      let moduleStatements: string[] = [];

      program
        .getTsProgram()
        .getSourceFiles()
        .filter(x => !/node_modules|\.ngfactory|\.ngstyle|(\.d\.ts$)/.test(x.fileName))
        .forEach(sourceFile => {
          sourceFile.statements
            .filter(x => ts.isImportDeclaration(x) || ts.isExportDeclaration(x))
            .forEach((node: ts.ImportDeclaration | ts.ExportDeclaration) => {
              const { moduleSpecifier } = node;
              if (!moduleSpecifier) {
                return;
              }

              const text = moduleSpecifier.getText();
              const trimmedText = text.substring(1, text.length - 1);
              if (!trimmedText.startsWith('.')) {
                moduleStatements.push(trimmedText);
              }
            });
        });

      moduleStatements = unique(moduleStatements);
      moduleStatements.forEach(moduleName => {
        const dep = entryPoints.find(ep => ep.data.entryPoint.moduleId === moduleName);
        if (dep) {
          log.debug(`Found entry point dependency: ${moduleId} -> ${moduleName}`);

          if (moduleId === moduleName) {
            throw new Error(`Entry point ${moduleName} has a circular dependency on itself.`);
          }

          entryPoint.dependsOn(dep);
        }
      });
    };

    entryPoints.forEach(analyseEntryPoint);
    return graph;
  })
);
