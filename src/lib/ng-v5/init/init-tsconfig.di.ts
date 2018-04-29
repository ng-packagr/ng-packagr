// XX: has or is using name 'ParsedConfiguration' ... but cannot be named
import { ParsedConfiguration } from '@angular/compiler-cli/src/perform_compile';
import { InjectionToken, Provider } from 'injection-js';
import { Transform } from '../../brocc/transform';
import { TransformProvider, provideTransform } from '../../brocc/transform.di';
import { createDefaultTsConfig, TsConfig } from '../../ts/tsconfig';
import { initTsConfigTransformFactory } from './init-tsconfig.transform';

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
