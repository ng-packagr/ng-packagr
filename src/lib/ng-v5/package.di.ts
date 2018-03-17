import { InjectionToken, Provider } from 'injection-js';
import { Transform } from '../brocc/transform';
import { provideTransform, TransformProvider } from '../brocc/transform.di';
import { PROJECT_TOKEN } from './project.di';
import { ENTRY_POINT_TRANSFORM_TOKEN } from './entry-point.di';
import { packageTransformFactory } from './package.transform';
import { ANALYSE_SOURCES_TOKEN, ANALYSE_SOURCES_TRANSFORM } from './init/analyse-sources.di';
import {
  DEFAULT_TS_CONFIG_PROVIDER,
  DEFAULT_TS_CONFIG_TOKEN,
  INIT_TS_CONFIG_TRANSFORM,
  INIT_TS_CONFIG_TOKEN
} from './init/init-tsconfig.di';

export const PACKAGE_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.packageTransform`);

export const PACKAGE_TRANSFORM = provideTransform({
  provide: PACKAGE_TRANSFORM_TOKEN,
  useFactory: packageTransformFactory,
  deps: [PROJECT_TOKEN, INIT_TS_CONFIG_TOKEN, ANALYSE_SOURCES_TOKEN, ENTRY_POINT_TRANSFORM_TOKEN]
});

export const PACKAGE_PROVIDERS: Provider[] = [
  PACKAGE_TRANSFORM,
  DEFAULT_TS_CONFIG_PROVIDER,
  INIT_TS_CONFIG_TRANSFORM,
  ANALYSE_SOURCES_TRANSFORM
];
