import { InjectionToken, FactoryProvider } from 'injection-js';
import * as ts from 'typescript';
import * as path from 'path';
import { TsConfig, DEFAULT_TS_CONFIG_TOKEN } from './default-tsconfig';
import { BuildStep } from '../deprecations';

/**
 * Initializes TypeScript Compiler options and Angular Compiler options by overriding the
 * default config with entry point-specific values.
 */
export const initTsConfigFactory: (def: TsConfig) => BuildStep = defaultTsConfig => ({
  artefacts,
  entryPoint,
  pkg
}) => {
  const basePath = path.dirname(entryPoint.entryFilePath);

  // Resolve defaults from DI token
  const tsConfig = { ...defaultTsConfig };

  tsConfig.rootNames = [entryPoint.entryFilePath];
  tsConfig.options.flatModuleId = entryPoint.moduleId;
  tsConfig.options.flatModuleOutFile = `${entryPoint.flatModuleFile}.js`;
  tsConfig.options.basePath = basePath;
  tsConfig.options.baseUrl = basePath;
  tsConfig.options.rootDir = basePath;
  tsConfig.options.outDir = artefacts.outDir;
  tsConfig.options.genDir = artefacts.outDir;

  if (entryPoint.languageLevel) {
    // ng.readConfiguration implicitly converts "es6" to "lib.es6.d.ts", etc.
    tsConfig.options.lib = entryPoint.languageLevel.map(lib => `lib.${lib}.d.ts`);
  }

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
};

export const INIT_TS_CONFIG_TOKEN = new InjectionToken<BuildStep>('ng.v5.prepareTsConfig');

export const INIT_TS_CONFIG_PROVIDER: FactoryProvider = {
  provide: INIT_TS_CONFIG_TOKEN,
  useFactory: initTsConfigFactory,
  deps: [DEFAULT_TS_CONFIG_TOKEN]
};
