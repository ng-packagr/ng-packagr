import { InjectionToken, Provider } from 'injection-js';
import { Transform } from '../graph/transform';
import { TransformProvider, provideTransform } from '../graph/transform.di';
import { PROJECT_TOKEN } from '../project.di';
import { ANALYSE_SOURCES_TOKEN, ANALYSE_SOURCES_TRANSFORM } from './entry-point/analyse-sources.di';
import { ENTRY_POINT_TRANSFORM_TOKEN } from './entry-point/entry-point.di';
import {
  INIT_TS_CONFIG_TOKEN,
  INIT_TS_CONFIG_TRANSFORM,
} from './entry-point/init-tsconfig.di';
import { DEFAULT_OPTIONS_PROVIDER, OPTIONS_TOKEN } from './options.di';
import { packageTransformFactory } from './package.transform';

export const PACKAGE_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.packageTransform`);

export const PACKAGE_TRANSFORM: TransformProvider = provideTransform({
  provide: PACKAGE_TRANSFORM_TOKEN,
  useFactory: packageTransformFactory,
  deps: [PROJECT_TOKEN, OPTIONS_TOKEN, INIT_TS_CONFIG_TOKEN, ANALYSE_SOURCES_TOKEN, ENTRY_POINT_TRANSFORM_TOKEN],
});

export const PACKAGE_PROVIDERS: Provider[] = [
  PACKAGE_TRANSFORM,
  DEFAULT_OPTIONS_PROVIDER,
  INIT_TS_CONFIG_TRANSFORM,
  ANALYSE_SOURCES_TRANSFORM,
];
