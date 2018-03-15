import { map } from 'rxjs/operators';
import { pipe } from 'rxjs/util/pipe';
import * as ng from '@angular/compiler-cli';
import * as ts from 'typescript';
import * as log from '../../util/log';
import { Node } from '../../brocc/node';
import { Transform } from '../../brocc/transform';
import { transformSourceFiles } from '../../ngc/transform-source-files';
import { analyseDependencies } from '../../ts/analyse-dependencies-transformer';
import { transformComponentSourceFiles } from '../../ts/ng-component-transformer';
import { TsConfig } from '../../ts/tsconfig';
import { isEntryPoint, TemplateNode, StylesheetNode, TypeScriptSourceNode, fileUrl, tsUrl } from '../nodes';

export const analyseSourcesTransform: Transform = pipe(
  map(graph => {
    const entryPoints = graph.filter(isEntryPoint);
    for (let entryPoint of entryPoints) {
      log.debug(`Analysing sources for ${entryPoint.data.entryPoint.moduleId}`);

      // Extracts templateUrl and styleUrls from `@Component({..})` decorators.
      const extractResources = transformComponentSourceFiles({
        template: ({ templateFilePath }) => {
          const templateNode = new TemplateNode(fileUrl(templateFilePath));
          graph.put(templateNode);

          // mark that entryPoint depends on node
          entryPoint.dependsOn(templateNode);
        },
        stylesheet: ({ styleFilePath }) => {
          const stylesheetNode = new StylesheetNode(fileUrl(styleFilePath));
          graph.put(stylesheetNode);

          // mark that entryPoint depends on node
          entryPoint.dependsOn(stylesheetNode);
        }
      });

      // Extract TypeScript dependencies from source text (`import .. from 'moduleId'`)
      const extractDependencies = analyseDependencies((sourceFile, moduleId) => {
        log.debug(`Found dependency in ${sourceFile.fileName}: ${moduleId}`);
        const dep = entryPoints.find(ep => ep.data.entryPoint.moduleId === moduleId);
        if (dep) {
          log.debug(
            `Found entry point dependency: ${entryPoint.data.entryPoint.moduleId} -> ${dep.data.entryPoint.moduleId}`
          );
          entryPoint.dependsOn(dep);
        }
      });

      // TODO: a typescript `SourceFile` may also be added as individual nod to the graph
      const tsSourcesNode = new TypeScriptSourceNode(tsUrl(entryPoint.data.entryPoint.moduleId));
      tsSourcesNode.data = transformSourceFiles(entryPoint.data.tsConfig, [extractResources, extractDependencies]);
      graph.put(tsSourcesNode);
      entryPoint.dependsOn(tsSourcesNode);
    }

    return graph;
  })
);
