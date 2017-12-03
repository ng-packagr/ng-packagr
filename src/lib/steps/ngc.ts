import * as fs from 'fs';
import * as path from 'path';
import * as ng from '@angular/compiler-cli';
// XX: has or is using name 'ParsedConfiguration' ... but cannot be named
import { ParsedConfiguration } from '@angular/compiler-cli';
import * as ts from 'typescript';
import { Artefacts } from '../domain/build-artefacts';
import { NgEntryPoint } from '../domain/ng-package-format';
import * as log from '../util/log';
import { componentTransformer } from '../util/ts-transformers';

/** TypeScript configuration used internally (marker typer). */
export type TsConfig = ng.ParsedConfiguration;

/** Prepares TypeScript Compiler and Angular Compiler option. */
export const prepareTsConfig =
  (entryPoint: NgEntryPoint, artefacts: Artefacts): TsConfig => {
    const basePath = path.dirname(entryPoint.entryFilePath);

    // Read the default configuration and overwrite package-specific options
    const tsConfig = ng.readConfiguration(path.resolve(__dirname, '..', 'conf', 'tsconfig.ngc.json'));
    tsConfig.rootNames = [ entryPoint.entryFilePath ];
    tsConfig.options.flatModuleId = entryPoint.moduleId
    tsConfig.options.flatModuleOutFile = `${entryPoint.flatModuleFile}.js`;
    tsConfig.options.basePath = basePath;
    tsConfig.options.baseUrl = basePath;
    tsConfig.options.outDir = artefacts.outDir;
    tsConfig.options.genDir = artefacts.outDir;

    switch (entryPoint.jsxConfig) {
      case 'preserve':
        tsConfig.options.jsx = ts.JsxEmit.Preserve;
        break;
      case 'react':
        tsConfig.options.jsx = ts.JsxEmit.React;
        break;
      case 'react-native':
        tsConfig.options.jsx = ts.JsxEmit.ReactNative;
        break;
      default:
        break;
    }

    return tsConfig;
  }

const transformSources =
  (tsConfig: TsConfig, transformers: ts.TransformerFactory<ts.SourceFile>[]): ts.TransformationResult<ts.SourceFile> => {
    const compilerHost: ng.CompilerHost = ng.createCompilerHost({
      options: tsConfig.options
    });
    const program: ng.Program = ng.createProgram({
      rootNames: [ ...tsConfig.rootNames ],
      options: tsConfig.options,
      host: compilerHost
    });

    // transform typescript AST prior to compilation
    const transformationResult: ts.TransformationResult<ts.SourceFile> = ts.transform(
      program.getTsProgram().getSourceFiles(),
      transformers,
      tsConfig.options
    );

    return transformationResult;
  }

const compilerHostFromTransformation =
  ({transformation, options}: {transformation: ts.TransformationResult<ts.SourceFile>, options: ts.CompilerOptions}): ts.CompilerHost => {
    const wrapped = ts.createCompilerHost(options);

    return {
      ...wrapped,
      getSourceFile: (fileName, version) => {
        const inTransformation = transformation.transformed.find((file) => file.fileName === fileName);

        if (inTransformation) {
          // FIX see https://github.com/Microsoft/TypeScript/issues/19950
          if (!inTransformation['ambientModuleNames']) {
            inTransformation['ambientModuleNames'] = inTransformation['original']['ambientModuleNames'];
          }

          return inTransformation;
        } else {
          return wrapped.getSourceFile(fileName, version);
        }
      },
      getSourceFileByPath: (fileName, path, languageVersion) => {
        console.warn("getSourceFileByPath");

        return wrapped.getSourceFileByPath(fileName, path, languageVersion);
      }
    };
  }

/** Extracts templateUrl and styleUrls from `@Component({..})` decorators. */
export const collectTemplateAndStylesheetFiles =
  (tsConfig: TsConfig, artefacts: Artefacts): ts.TransformationResult<ts.SourceFile> => {
    const collector = componentTransformer({
      templateProcessor: (a, b, templateFilePath) => {
        artefacts.template(templateFilePath, null);
      },
      stylesheetProcessor: (a, b, styleFilePath) => {
        artefacts.stylesheet(styleFilePath, null);
      }
    });

    return transformSources(
      tsConfig,
      [ collector ]
    );
  }

/** Transforms templateUrl and styleUrls in `@Component({..})` decorators. */
export const inlineTemplatesAndStyles =
  (tsConfig: TsConfig, artefacts: Artefacts): ts.TransformationResult<ts.SourceFile> => {
    // inline contents from artefacts set (generated in a previous step)
    const transformer = componentTransformer({
      templateProcessor: (a, b, templateFilePath) => artefacts.template(templateFilePath) || '',
      stylesheetProcessor: (a, b, styleFilePath) => artefacts.stylesheet(styleFilePath) || ''
    });

    return transformSources(
      tsConfig,
      [ transformer ]
    );
  }

/**
 * Compiles typescript sources with 'ngc'.
 *
 * @param entryPoint Angular package data
 * @returns Promise<{}> Pathes of the flatModuleOutFile
 */
export async function ngc(entryPoint: NgEntryPoint, sources: ts.TransformationResult<ts.SourceFile>, tsConfig: TsConfig) {
  log.debug(`ngc (v${ng.VERSION.full}): ${entryPoint.entryFile}`);

  // ng.CompilerHost
  const ngCompilerHost = ng.createCompilerHost({
    options: tsConfig.options,
    tsHost: compilerHostFromTransformation({
      options: tsConfig.options,
      transformation: sources
    })
  });

  // ng.Program
  const ngProgram = ng.createProgram({
    rootNames: [ ...tsConfig.rootNames ],
    options: tsConfig.options,
    host: ngCompilerHost
  });

  // ngc
  const result = ng.performCompilation({
    rootNames: [ ...tsConfig.rootNames ],
    options: tsConfig.options,
    emitFlags: tsConfig.emitFlags,
    host: ngCompilerHost,
    oldProgram: ngProgram
  });

  const exitCode = ng.exitCodeFromResult(result.diagnostics);
  if (exitCode === 0) {
    const outDir = tsConfig.options.outDir;
    const outFile = tsConfig.options.flatModuleOutFile;
    const extName = path.extname(outFile);

    return Promise.resolve({
      js: path.resolve(outDir, outFile),
      metadata: path.resolve(outDir, outFile.replace(extName, '.metadata.json')),
      typings: path.resolve(outDir, outFile.replace(extName, '.d.ts'))
    });
  } else {
    return Promise.reject(new Error(
      ng.formatDiagnostics(result.diagnostics)
    ));
  }
}
