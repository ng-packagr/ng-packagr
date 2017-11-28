import * as fs from 'fs';
import * as path from 'path';
import * as ng from '@angular/compiler-cli';
// XX: has or is using name 'ParsedConfiguration' ... but cannot be named
import { ParsedConfiguration } from '@angular/compiler-cli';
import * as ts from 'typescript';
import { NgPackageData } from '../model/ng-package-data';
import * as log from '../util/log';
import { componentTransformer } from './ts-transformers';
import { NgArtefacts } from '../domain/ng-artefacts';
import { SourceFile } from 'typescript';

/** TypeScript configuration used internally (marker typer). */
export type TsConfig = ng.ParsedConfiguration;

/** Prepares TypeScript Compiler and Angular Compiler option. */
export const prepareTsConfig =
  (ngPkg: NgPackageData): TsConfig => {
    const basePath = ngPkg.sourcePath;

    // Read the default configuration and overwrite package-specific options
    const tsConfig = ng.readConfiguration(path.resolve(__dirname, '..', 'conf', 'tsconfig.ngc.json'));
    tsConfig.rootNames = [ path.resolve(basePath, ngPkg.entryFile) ];
    tsConfig.options.flatModuleId = ngPkg.fullPackageName
    tsConfig.options.flatModuleOutFile = `${ngPkg.flatModuleFileName}.js`;
    tsConfig.options.basePath = basePath;
    tsConfig.options.baseUrl = basePath;
    tsConfig.options.outDir = ngPkg.buildDirectory; // path.resolve(basePath, '.ng_pkg_build');
    tsConfig.options.genDir = ngPkg.buildDirectory; // path.resolve(basePath, '.ng_pkg_build');

    switch (ngPkg.jsxConfig) {
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
  (tsConfig: TsConfig, artefacts: NgArtefacts): ts.TransformationResult<ts.SourceFile> => {
    const collector = componentTransformer({
      templateProcessor: (a, b, templateFilePath) => {
        artefacts.template(templateFilePath, '');
      },
      stylesheetProcessor: (a, b, styleFilePath) => {
        artefacts.stylesheet(styleFilePath, '');
      }
    });

    return transformSources(
      tsConfig,
      [ collector ]
    );
  }

/** Transforms templateUrl and styleUrls in `@Component({..})` decorators. */
export const inlineTemplatesAndStyles =
  (tsConfig: TsConfig, artefacts: NgArtefacts): ts.TransformationResult<ts.SourceFile> => {
    // inline contents from artefacts set (generated in a previous step)
    const transformer = componentTransformer({
      templateProcessor: (a, b, templateFilePath) => artefacts.template(templateFilePath) || undefined,
      stylesheetProcessor: (a, b, styleFilePath) => artefacts.stylesheet(styleFilePath) || undefined
    });

    return transformSources(
      tsConfig,
      [ transformer ]
    );
  }

/**
 * Compiles typescript sources with 'ngc'.
 *
 * @param ngPkg Angular package data
 * @returns Promise<{}> Pathes of the flatModuleOutFile
 */
export async function ngc(ngPkg: NgPackageData, sources: ts.TransformationResult<SourceFile>, tsConfig: TsConfig) {
  log.debug(`ngc (v${ng.VERSION.full}): ${ngPkg.entryFile}`);

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
    const outFile = path.resolve(ngPkg.sourcePath, tsConfig.options.outDir, tsConfig.options.flatModuleOutFile);
    return Promise.resolve({
      js: outFile,
      metadata: outFile.replace('.js', '.metadata.json'),
      typings: outFile.replace('.js', '.d.ts')
    });
  } else {
    return Promise.reject(new Error(
      ng.formatDiagnostics(result.diagnostics)
    ));
  }
}
