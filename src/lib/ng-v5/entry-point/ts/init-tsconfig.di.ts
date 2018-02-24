import { ParsedConfiguration } from '@angular/compiler-cli';
import { InjectionToken, Provider, ValueProvider } from 'injection-js';
import { Transform } from '../../../brocc/transform';
import { TransformProvider, provideTransform } from '../../../brocc/transform.di';
import { initTsConfigTransformFactory } from './init-tsconfig.transform';
import { createDefaultTsConfig, TsConfig } from '../../../ts/tsconfig';

export const provideTsConfig = (values?: TsConfig | string): Provider => {
  return {
    provide: DEFAULT_TS_CONFIG_TOKEN,
    useFactory: () => {
      return createDefaultTsConfig(values);
    },
    deps: []
  };
};

export const DEFAULT_TS_CONFIG_TOKEN = new InjectionToken<TsConfig>('ng.v5.defaultTsConfig');

export const DEFAULT_TS_CONFIG_PROVIDER: Provider = provideTsConfig();

export const INIT_TS_CONFIG_TOKEN = new InjectionToken<Transform>('ng.v5.initTsConfigTransform');

export const INIT_TS_CONFIG_TRANSFORM: TransformProvider = provideTransform({
  provide: INIT_TS_CONFIG_TOKEN,
  useFactory: initTsConfigTransformFactory,
  deps: [DEFAULT_TS_CONFIG_TOKEN]
});
