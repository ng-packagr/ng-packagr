import * as fs from 'fs';
import * as path from 'path';
import * as ng from '@angular/compiler-cli';
// XX: has or is using name 'ParsedConfiguration' ... but cannot be named
import { ParsedConfiguration } from '@angular/compiler-cli';
import * as ts from 'typescript';
import { Artefacts } from '../domain/build-artefacts';
import { BuildStep } from '../domain/build-step';
import { NgEntryPoint } from '../domain/ng-package-format';
import * as log from '../util/log';
// XX: internal in ngc's `main()`, a tsickle emit callback is passed to the tsc compiler
// ... blatanlty copy-paste the emit callback here. it's not a public api.
// ... @link https://github.com/angular/angular/blob/24bf3e2a251634811096b939e61d63297934579e/packages/compiler-cli/src/main.ts#L36-L38
import { createEmitCallback } from '../util/ngc-patches';
import { componentTransformer } from '../util/ts-transformers';

/** TypeScript configuration used internally (marker typer). */
export type TsConfig = ng.ParsedConfiguration;

/** Prepares TypeScript Compiler and Angular Compiler option. */
export const prepareTsConfig: BuildStep =
  ({ artefacts, entryPoint, pkg }) => {
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

    artefacts.tsConfig = tsConfig;
  }

/** Transforms TypeScript AST */
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
    const transformationResult: ts.TransformationResult<ts.SourceFile> = ts.transform(
      program.getTsProgram().getSourceFiles(),
      transformers,
      tsConfig.options
    );

    return transformationResult;
  }

//const compilerHostFromTransformation =
//  ({transformation, options}: {transformation: ts.TransformationResult<ts.SourceFile>, options: ts.CompilerOptions}): ts.CompilerHost => {

const compilerHostFromArtefacts =
  (artefacts: Artefacts) => {
    const wrapped = ts.createCompilerHost(artefacts.tsConfig.options);

    return {
      ...wrapped,
      getSourceFile: (fileName, version) => {
        const inTransformation = artefacts.tsSources.transformed
          .find((file) => file.fileName === fileName);

        if (inTransformation) {
          // FIX see https://github.com/Microsoft/TypeScript/issues/19950
          if (!inTransformation['ambientModuleNames']) {
            inTransformation['ambientModuleNames'] = inTransformation['original']['ambientModuleNames'];
          }

          // FIX synthesized source files cause ngc/tsc/tsickle to chock
          if ((inTransformation.flags & 8) !== 0) {
            const sourceText = artefacts.extras<SynthesizedSourceFile>(`ts:${inTransformation.fileName}`).writeSourceText();

            return ts.createSourceFile(
              inTransformation.fileName,
              sourceText,
              inTransformation.languageVersion,
              true,
              ts.ScriptKind.TS
            );
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
export const collectTemplateAndStylesheetFiles: BuildStep =
  ({ artefacts, entryPoint, pkg }) => {
    const tsConfig = artefacts.tsConfig;

    const collector = componentTransformer({
      templateProcessor: (a, b, templateFilePath) => {
        artefacts.template(templateFilePath, null);
      },
      stylesheetProcessor: (a, b, styleFilePath) => {
        artefacts.stylesheet(styleFilePath, null);
      }
    });

    artefacts.tsSources = transformSources(
      tsConfig,
      [ collector ]
    );
  }

class SynthesizedSourceFile {

  private replacemenets: { from: number, to: number, text: string}[] = [];

  constructor(
    private original: ts.SourceFile
  ) {}

  addReplacement(replacement: { from: number, to: number, text: string}) {
    this.replacemenets.push(replacement);
  }

  public writeSourceText(): string {
    const originalSource = this.original.getFullText();

    let newSource = '';
    let position = 0;
    for (let replacement of this.replacemenets) {
      newSource = newSource.concat(originalSource.substring(position, replacement.from))
        .concat(replacement.text);
      position = replacement.to;
    }
    newSource = newSource.concat(originalSource.substring(position));

    return newSource;
  }

}

/** Transforms templateUrl and styleUrls in `@Component({..})` decorators. */
export const inlineTemplatesAndStyles: BuildStep =
  ({ artefacts, entryPoint, pkg }) => {
    const tsConfig = artefacts.tsConfig;
    // inline contents from artefacts set (generated in a previous step)
    const transformer = componentTransformer({
      templateProcessor: (a, b, templateFilePath) => artefacts.template(templateFilePath) || '',
      stylesheetProcessor: (a, b, styleFilePath) => artefacts.stylesheet(styleFilePath) || '',
      sourceFileWriter: (sourceFile, node, synthesizedSourceText) => {
        const key = `ts:${sourceFile.fileName}`;

        const synthesizedSourceFile = artefacts.extras<SynthesizedSourceFile>(key) || new SynthesizedSourceFile(sourceFile);
        synthesizedSourceFile.addReplacement({
          from: node.getStart(),
          to: node.getEnd(),
          text: synthesizedSourceText
        });

        artefacts.extras(key, synthesizedSourceFile);
      }
    });

    artefacts.tsSources = ts.transform(
      artefacts.tsSources.transformed,
      [ transformer ]
    );
  }

/**
 * Compiles typescript sources with 'ngc'.
 *
 * @param entryPoint Angular package data
 * @returns Promise<{}> Pathes of the flatModuleOutFile
 */
export async function ngc(entryPoint: NgEntryPoint, artefacts: Artefacts) {
  log.debug(`ngc (v${ng.VERSION.full}): ${entryPoint.entryFile}`);

  // ng.CompilerHost
  const tsConfig = artefacts.tsConfig;
  const ngCompilerHost = ng.createCompilerHost({
    options: tsConfig.options,
    tsHost: compilerHostFromArtefacts(artefacts)
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
    emitCallback: createEmitCallback(tsConfig.options),
    host: ngCompilerHost,
    oldProgram: ngProgram
  });

  const exitCode = ng.exitCodeFromResult(result.diagnostics);
  if (exitCode === 0) {
    const outDir = tsConfig.options.outDir;
    const outFile = tsConfig.options.flatModuleOutFile;
    const extName = path.extname(outFile);

    artefacts.tsSources.dispose();

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
