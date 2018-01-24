import * as ng from '@angular/compiler-cli';
// XX: has or is using name 'ParsedConfiguration' ... but cannot be named
import { ParsedConfiguration } from '@angular/compiler-cli';
import { InjectionToken, FactoryProvider } from 'injection-js';
import * as path from 'path';
import * as ts from 'typescript';
import { BuildStep } from '../deprecations';

/**
 * TypeScript configuration used internally (marker typer).
 */
export type TsConfig = ng.ParsedConfiguration;

/**
 * Reads the default TypeScript configuration.
 */
export function defaultTsConfigFactory() {
  return ng.readConfiguration(path.resolve(__dirname, 'conf', 'tsconfig.ngc.json'));
}

export const DEFAULT_TS_CONFIG_TOKEN = new InjectionToken<TsConfig>('ng.v5.defaultTsConfig');

export const DEFAULT_TS_CONFIG_PROVIDER: FactoryProvider = {
  provide: DEFAULT_TS_CONFIG_TOKEN,
  useFactory: defaultTsConfigFactory,
  deps: []
};
