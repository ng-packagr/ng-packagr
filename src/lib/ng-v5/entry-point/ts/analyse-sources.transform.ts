import { map } from 'rxjs/operators';
import { pipe } from 'rxjs/util/pipe';
import * as ng from '@angular/compiler-cli';
import * as ts from 'typescript';
import * as log from '../../../util/log';
import { Node } from '../../../brocc/node';
import { Transform } from '../../../brocc/transform';
import { transformSourceFiles } from '../../../ngc/transform-source-files';
import { transformComponentSourceFiles } from '../../../ts/ng-component-transformer';
import { TsConfig } from '../../../ts/tsconfig';
import { byEntryPoint, isInProgress } from '../../entry-point.node';

export const analyseSourcesTransform: Transform = pipe(
  map(graph => {
    const entryPoint = graph.find(byEntryPoint().and(isInProgress));
    log.debug(`Analysing sources for ${entryPoint.data.entryPoint.moduleId}`);

    const tsConfig = entryPoint.data.tsConfig;

    /** Extracts templateUrl and styleUrls from `@Component({..})` decorators. */
    const extractResources = transformComponentSourceFiles({
      template: ({ templateFilePath }) => {
        // TODO: HtmlNode / TemplateNode
        const node = new Node('file://' + templateFilePath);
        node.type = 'text/html';
        graph.put(node);

        // TODO: mark entryPoint dependsOn node
        entryPoint.addDependent(node);
      },
      stylesheet: ({ styleFilePath }) => {
        // TODO: CssNode / StylesheetNode
        const node = new Node('file://' + styleFilePath);
        node.type = 'text/css';
        graph.put(node);

        // TODO: mark entryPoint dependsOn node
        entryPoint.addDependent(node);
      }
    });

    // XX: ideally, the TypeScript sources are added as individual nodes on the graph
    entryPoint.data.tsSources = transformSourceFiles(tsConfig, [extractResources]);

    // TODO: typescript sources may also be added as individual nodes on the graph
    const tsSourcesNode = new Node('ts://' + entryPoint.data.entryPoint.moduleId);
    tsSourcesNode.type = 'application/ts';
    tsSourcesNode.data = entryPoint.data.tsSources;
    graph.put(tsSourcesNode);
    // TODO: mark entryPoint dependsOn tsSourcesNode

    return graph;
  })
);
