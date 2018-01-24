import * as fs from 'fs';
import * as path from 'path';
import * as ng from '@angular/compiler-cli';
// XX: has or is using name 'ParsedConfiguration' ... but cannot be named
import { ParsedConfiguration } from '@angular/compiler-cli';
import * as ts from 'typescript';
import { NgArtefacts } from '../ng-package-format/artefacts';
import { NgEntryPoint } from '../ng-package-format/entry-point';
import { NgPackage } from '../ng-package-format/package';
import { BuildStep } from '../deprecations';
import * as log from '../util/log';
import { createEmitCallback } from '../ngc/create-emit-callback';
import { componentTransformer } from '../ts/ng-component-transformer';
import { replaceWithSynthesizedSourceText, SynthesizedSourceFile } from '../ts/synthesized-source-file';
import { createCompilerHostForSynthesizedSourceFiles } from '../ts/synthesized-compiler-host';
import { TsConfig } from '../ts/default-tsconfig';

/** Transforms TypeScript AST */
const transformSources = (
  tsConfig: TsConfig,
  transformers: ts.TransformerFactory<ts.SourceFile>[]
): ts.TransformationResult<ts.SourceFile> => {
  const compilerHost: ng.CompilerHost = ng.createCompilerHost({
    options: tsConfig.options
  });
  const program: ng.Program = ng.createProgram({
    rootNames: [...tsConfig.rootNames],
    options: tsConfig.options,
    host: compilerHost
  });

  const sourceFiles = program.getTsProgram().getSourceFiles();
  const transformationResult: ts.TransformationResult<ts.SourceFile> = ts.transform(
    // XX: circumvent tsc compile error in 2.6
    Array.from((sourceFiles as any) as ts.SourceFile[]),
    transformers,
    tsConfig.options
  );

  return transformationResult;
};

/** Extracts templateUrl and styleUrls from `@Component({..})` decorators. */
export const collectTemplateAndStylesheetFiles: BuildStep = ({ artefacts, entryPoint, pkg }) => {
  const tsConfig = artefacts.tsConfig;

  const collector = componentTransformer({
    templateProcessor: (a, b, templateFilePath) => {
      artefacts.template(templateFilePath, null);
    },
    stylesheetProcessor: (a, b, styleFilePath) => {
      artefacts.stylesheet(styleFilePath, null);
    }
  });

  artefacts.tsSources = transformSources(tsConfig, [collector]);
};

/** Transforms templateUrl and styleUrls in `@Component({..})` decorators. */
export const inlineTemplatesAndStyles: BuildStep = ({ artefacts, entryPoint, pkg }) => {
  // inline contents from artefacts set (generated in a previous step)
  const transformer = componentTransformer({
    templateProcessor: (a, b, templateFilePath) => artefacts.template(templateFilePath) || '',
    stylesheetProcessor: (a, b, styleFilePath) => artefacts.stylesheet(styleFilePath) || '',
    sourceFileWriter: (sourceFile, node, synthesizedSourceText) => {
      const key = `ts:${sourceFile.fileName}`;
      const synthesizedSourceFile = replaceWithSynthesizedSourceText(node, synthesizedSourceText);

      artefacts.extras(key, synthesizedSourceFile);
    }
  });

  artefacts.tsSources = ts.transform(artefacts.tsSources.transformed, [transformer]);
};

/**
 * Compiles typescript sources with 'ngc'.
 *
 * @param entryPoint Angular package data
 * @returns Promise<{}> Pathes of the flatModuleOutFile
 */
export async function ngc(entryPoint: NgEntryPoint, artefacts: NgArtefacts) {
  log.debug(`ngc (v${ng.VERSION.full}): ${entryPoint.entryFile}`);

  // XX ... hacky
  const mixedSourceFiles = [...artefacts.tsSyntheticSourcFiles(), ...artefacts.tsSources.transformed];

  // ng.CompilerHost
  const tsConfig = artefacts.tsConfig;
  const ngCompilerHost = ng.createCompilerHost({
    options: tsConfig.options,
    tsHost: createCompilerHostForSynthesizedSourceFiles(mixedSourceFiles, artefacts.tsConfig.options)
  });

  // ng.Program
  const ngProgram = ng.createProgram({
    rootNames: [...tsConfig.rootNames],
    options: tsConfig.options,
    host: ngCompilerHost
  });

  // ngc
  const result = ng.performCompilation({
    rootNames: [...tsConfig.rootNames],
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
    return Promise.reject(new Error(ng.formatDiagnostics(result.diagnostics)));
  }
}
