import * as ng from '@angular/compiler-cli';
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import stripBom = require('strip-bom');
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import * as log from '../../util/log';
import { Transform } from '../../brocc/transform';
import { isEntryPoint, TemplateNode, StylesheetNode, fileUrl } from '../nodes';
import { Node } from '../../brocc/node';
import { ensureUnixPath } from '../../util/path';

export const analyseSourcesTransform: Transform = pipe(
  map(graph => {
    const entryPoints = graph.filter(isEntryPoint);
    const analyseEntryPoint = (entryPoint: Node) => {
      const fileCache = new Map<string, string>();
      const { tsConfig } = entryPoint.data;
      const resolutionCache = ts.createModuleResolutionCache(tsConfig.options.basePath, s => s);

      const compilerHost: ng.CompilerHost = {
        ...ng.createCompilerHost({
          options: tsConfig.options
        }),

        moduleNameToFileName: (moduleName: string, containingFile: string) => {
          log.debug(`Found dependency in ${containingFile}: ${moduleName}`);
          const dep = entryPoints.find(ep => ep.data.entryPoint.moduleId === moduleName);

          if (dep) {
            log.debug(
              `Found entry point dependency: ${entryPoint.data.entryPoint.moduleId} -> ${dep.data.entryPoint.moduleId}`
            );
            entryPoint.dependsOn(dep);
          }

          const resolvedModule = ts.resolveModuleName(
            moduleName,
            ensureUnixPath(containingFile),
            tsConfig.options,
            compilerHost,
            resolutionCache
          ).resolvedModule;
          return resolvedModule && resolvedModule.resolvedFileName;
        },

        resourceNameToFileName: (resourceName: string, containingFilePath: string) => {
          return path.resolve(path.dirname(containingFilePath), resourceName);
        },

        readResource: (fileName: string) => {
          const nodeUrl = fileUrl(ensureUnixPath(fileName));
          if (fileCache.has(nodeUrl)) {
            return '';
          }

          let content = fs.readFileSync(fileName, { encoding: 'utf-8' });
          content = stripBom(content);
          // cache content, so that any subsequent requests gets returned and avoid extra IO operations
          fileCache.set(nodeUrl, content);

          let node: TemplateNode | StylesheetNode;
          if (fileName.endsWith('html')) {
            node = new TemplateNode(nodeUrl);
            node.data = { content };
          } else {
            node = new StylesheetNode(nodeUrl);
            node.data = { source: content };
          }

          graph.put(node);
          // mark that entryPoint depends on node
          entryPoint.dependsOn(node);

          // Return empty string so that Compiler doesn't parse it.
          return '';
        }
      };

      const program: ng.Program = ng.createProgram({
        rootNames: tsConfig.rootNames,
        options: tsConfig.options,
        host: compilerHost
      });

      const diagnostics = program.getNgStructuralDiagnostics();
      log.info(ng.formatDiagnostics(diagnostics));
    };

    entryPoints.forEach(analyseEntryPoint);
    return graph;
  })
);
