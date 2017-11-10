import * as glob from 'glob';
import { readJson, writeJson } from 'fs-extra';
import { promisify } from './promisify';
import { debug } from './log';

/**
 * Modifies a set of JSON files by invoking `modifyFn`
 *
 * @param globPattern A glob pattern matching several files. Example: '**\/*.js.map'
 * @param modifyFn A callback function that takes a JSON-parsed input and should return an output
 *                  that will be JSON-stringified
 */
export async function modifyJsonFiles(globPattern: string, modifyFn: (jsonObj: any) => any): Promise<void> {

  debug('modifyJsonFiles');
  const fileNames: string[] = await promisify<string[]>((resolveOrReject) => {
    glob(globPattern, resolveOrReject);
  });

  await Promise.all(
    fileNames.map(async (fileName: string): Promise<void> => {
      const fileContent: any = await tryReadJson(fileName);
      const modified = modifyFn(fileContent);
      await writeJson(fileName, modified);
    }
  ));
}

/**
 * Read json and don't throw if json parsing fails.
 *
 * @param filePath Path to the file which is parsed.
 */
export async function tryReadJson(filePath: string): Promise<any> {
  try {
    return await readJson(filePath);
  } catch (e) {
    // this means the file was empty or not json, which is fine
    return await Promise.resolve({});
  }
}
