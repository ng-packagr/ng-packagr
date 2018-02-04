import { map } from 'rxjs/operators';
import { pipe } from 'rxjs/util/pipe';
import * as ts from 'typescript';
import { Transform } from '../../../brocc/transform';
import * as log from '../../../util/log';
import { transformSourceFiles } from '../../../ngc/transform-source-files';
import { transformComponentSourceFiles } from '../../../ts/ng-component-transformer';
import { byEntryPoint, isInProgress } from '../../entry-point.node';

export const transformSourcesTransform: Transform = pipe(
  map(graph => {
    const entryPoint = graph.find(byEntryPoint().and(isInProgress));
    log.debug(`Transforming TypeScript sources for ${entryPoint.data.entryPoint.moduleId}`);

    // Transformer that inlines template and style data
    const inlineResources = transformComponentSourceFiles({
      template: ({ templateFilePath }) => {
        return graph.find(node => node.url === `file://${templateFilePath}`).data.content;
      },
      stylesheet: ({ styleFilePath }) => {
        return graph.find(node => node.url === `file://${styleFilePath}`).data.content;
      }
    });

    // XX: TsSourcesNode
    const previousTransform = entryPoint.data.tsSources as ts.TransformationResult<ts.SourceFile>;

    // Modify the TypeScript source files
    entryPoint.data.tsSources = transformSourceFiles(previousTransform, [inlineResources]);

    // Dispose the previous transformation result
    previousTransform.dispose();

    return graph;
  })
);
