import { InjectionToken, Provider, ValueProvider } from 'injection-js';
import { Transform } from '../brocc/transform';
import { TransformProvider, provideTransform } from '../brocc/transform.di';
import { TsConfig } from '../ts/tsconfig';
import { STYLESHEET_TRANSFORM, STYLESHEET_TRANSFORM_TOKEN } from './entry-point/resources/stylesheet.di';
import { ANALYSE_SOURCES_TOKEN, ANALYSE_SOURCES_TRANSFORM } from './entry-point/ts/analyse-sources.di';
import { COMPILE_NGC_TOKEN, COMPILE_NGC_TRANSFORM } from './entry-point/ts/compile-ngc.di';
import {
  DEFAULT_TS_CONFIG_PROVIDER,
  DEFAULT_TS_CONFIG_TOKEN,
  INIT_TS_CONFIG_TRANSFORM,
  INIT_TS_CONFIG_TOKEN
} from './entry-point/ts/init-tsconfig.di';
import { TRANSFORM_SOURCES_TOKEN, TRANSFORM_SOURCES_TRANSFORM } from './entry-point/ts/transform-sources.di';
import { TEMPLATE_TRANSFORM, TEMPLATE_TRANSFORM_TOKEN } from './entry-point/resources/template.di';
import {
  RELOCATE_SOURCE_MAPS_TRANSFORM,
  RELOCATE_SOURCE_MAPS_TRANSFORM_TOKEN
} from './entry-point/relocate-source-maps.di';
import { WRITE_BUNDLES_TRANSFORM, WRITE_BUNDLES_TRANSFORM_TOKEN } from './entry-point/write-bundles.di';
import { WRITE_PACKAGE_TRANSFORM, WRITE_PACKAGE_TRANSFORM_TOKEN } from './entry-point/write-package.di';
import { entryPointTransformFactory } from './entry-point.transform';

export const ENTRY_POINT_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.entryPointTransform`);

export const ENTRY_POINT_TRANSFORM: TransformProvider = provideTransform({
  provide: ENTRY_POINT_TRANSFORM_TOKEN,
  useFactory: entryPointTransformFactory,
  deps: [
    INIT_TS_CONFIG_TOKEN,
    ANALYSE_SOURCES_TOKEN,
    STYLESHEET_TRANSFORM_TOKEN,
    TEMPLATE_TRANSFORM_TOKEN,
    TRANSFORM_SOURCES_TOKEN,
    COMPILE_NGC_TOKEN,
    WRITE_BUNDLES_TRANSFORM_TOKEN,
    RELOCATE_SOURCE_MAPS_TRANSFORM_TOKEN,
    WRITE_PACKAGE_TRANSFORM_TOKEN
  ]
});

export const ENTRY_POINT_PROVIDERS: Provider[] = [
  ENTRY_POINT_TRANSFORM,
  INIT_TS_CONFIG_TRANSFORM,
  DEFAULT_TS_CONFIG_PROVIDER,
  ANALYSE_SOURCES_TRANSFORM,
  STYLESHEET_TRANSFORM,
  TEMPLATE_TRANSFORM,
  TRANSFORM_SOURCES_TRANSFORM,
  COMPILE_NGC_TRANSFORM,
  RELOCATE_SOURCE_MAPS_TRANSFORM,
  WRITE_BUNDLES_TRANSFORM,
  WRITE_PACKAGE_TRANSFORM
];
