// XX: internal in ngc's `main()`, a tsickle emit callback is passed to the tsc compiler
// ... blatantly copy-paste the emit callback here. it's not a public api.
// ... @link https://github.com/angular/angular/blob/24bf3e2a251634811096b939e61d63297934579e/packages/compiler-cli/src/main.ts#L36-L38

/*
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// @link https://github.com/angular/angular/blob/24bf3e2a251634811096b939e61d63297934579e/packages/compiler-cli/src/transformers/util.ts#L14
const GENERATED_FILES = /(.*?)\.(ngfactory|shim\.ngstyle|ngstyle|ngsummary)\.(js|d\.ts|ts)$/;

import * as tsickle from 'tsickle';
import * as api from '@angular/compiler-cli/src/transformers/api';

// @link https://github.com/angular/angular/blob/83d207d/packages/compiler-cli/src/main.ts#L42-L84
export function createEmitCallback(options: api.CompilerOptions): api.TsEmitCallback | undefined {
  const transformDecorators = !options.enableIvy && options.annotationsAs !== 'decorators';
  const transformTypesToClosure = options.annotateForClosureCompiler;
  if (!transformDecorators && !transformTypesToClosure) {
    return undefined;
  }

  if (options.annotateForClosureCompiler || options.annotationsAs === 'static fields') {
    if (transformDecorators) {
      // This is needed as a workaround for https://github.com/angular/tsickle/issues/635
      // Otherwise tsickle might emit references to non imported values
      // as TypeScript elided the import.
      options.emitDecoratorMetadata = true;
    }

    const tsickleHost: Pick<
      tsickle.TsickleHost,
      | 'shouldSkipTsickleProcessing'
      | 'pathToModuleName'
      | 'shouldIgnoreWarningsForPath'
      | 'fileNameToModuleId'
      | 'googmodule'
      | 'untyped'
      | 'convertIndexImportShorthand'
      | 'transformDecorators'
      | 'transformTypesToClosure'
    > = {
      shouldSkipTsickleProcessing: fileName => /\.d\.ts$/.test(fileName) || GENERATED_FILES.test(fileName),
      pathToModuleName: (_context, _importPath) => '',
      shouldIgnoreWarningsForPath: _filePath => false,
      fileNameToModuleId: fileName => fileName,
      googmodule: false,
      untyped: true,
      convertIndexImportShorthand: false,
      transformDecorators,
      transformTypesToClosure,
    };

    return ({
      program,
      targetSourceFile,
      writeFile,
      cancellationToken,
      emitOnlyDtsFiles,
      customTransformers = {},
      host,
      options,
    }) =>
      // tslint:disable-next-line:no-require-imports only depend on tsickle if requested
      require('tsickle').emitWithTsickle(
        program,
        { ...tsickleHost, options, host, moduleResolutionHost: host },
        host,
        options,
        targetSourceFile,
        writeFile,
        cancellationToken,
        emitOnlyDtsFiles,
        {
          beforeTs: customTransformers.before,
          afterTs: customTransformers.after,
        },
      );
  }

  return undefined;
}
