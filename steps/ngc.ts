import {main as tsc} from '@angular/tsc-wrapped';
import { debug } from '../util/log';


/**
 * Compiles typescript sources with 'ngc'.
 *
 * @param basePath
 */
export const ngc = (tsconfig: string, basePath: string): Promise<any> => {
  debug(`ngc ${tsconfig}, { basePath: ${basePath} })`);

  return tsc(tsconfig, { basePath });
}
