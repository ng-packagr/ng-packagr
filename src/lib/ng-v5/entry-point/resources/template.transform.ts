import { readFile } from 'fs-extra';
import { map } from 'rxjs/operators';
import { pipe } from 'rxjs/util/pipe';
import stripBom = require('strip-bom');
import { Transform, transformFromPromise } from '../../../brocc/transform';
import * as log from '../../../util/log';
import { byEntryPoint, isInProgress } from '../../entry-point.node';

export const templateTransform: Transform = transformFromPromise(async graph => {
  log.info(`Rendering Templates`);

  const entryPoint = graph.find(byEntryPoint().and(isInProgress));
  const templateNodes = graph.from(entryPoint).filter(node => node.type === 'text/html' && node.state !== 'done');

  // TOTO [].forEach(async fn)
  const promises = templateNodes.map(templateNode => {
    const templateFilePath = templateNode.url.substring('file://'.length);

    return processTemplate(templateFilePath).then(val => {
      templateNode.data = {
        ...templateNode.data,
        content: val
      };
    });
  });

  await Promise.all(promises);

  return graph;
});

/**
 * Process a component's template.
 *
 * @param templateFilePath Path of the HTML templatefile, e.g. `/Users/foo/Project/bar/bar.component.html`
 * @return Resolved content of HTML template file
 */
async function processTemplate(templateFilePath: string): Promise<string> {
  const buffer = await readFile(templateFilePath);

  return stripBom(buffer.toString());
}
