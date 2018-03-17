import { readFile } from 'fs-extra';
import stripBom = require('strip-bom');
import { Transform, transformFromPromise } from '../../../brocc/transform';
import * as log from '../../../util/log';
import { isEntryPointInProgress, URL_PROTOCOL_FILE } from '../../nodes';

export const templateTransform: Transform = transformFromPromise(async graph => {
  log.info(`Rendering Templates`);

  const entryPoint = graph.find(isEntryPointInProgress());
  const templateNodes = graph.from(entryPoint).filter(node => node.type === 'text/html' && node.state !== 'done');

  // TOTO [].forEach(async fn)
  const promises = templateNodes.map(templateNode => {
    const templateFilePath = templateNode.url.substring(URL_PROTOCOL_FILE.length);

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
