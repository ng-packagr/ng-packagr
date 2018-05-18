import { InjectionToken, Provider } from 'injection-js';
import { Transform } from '../brocc/transform';
import { TransformProvider, provideTransform } from '../brocc/transform.di';
import { STYLESHEET_TRANSFORM, STYLESHEET_TRANSFORM_TOKEN } from './entry-point/resources/stylesheet.di';
import { COMPILE_NGC_TOKEN, COMPILE_NGC_TRANSFORM } from './entry-point/ts/compile-ngc.di';
import { WRITE_BUNDLES_TRANSFORM, WRITE_BUNDLES_TRANSFORM_TOKEN } from './entry-point/write-bundles.di';
import { WRITE_PACKAGE_TRANSFORM, WRITE_PACKAGE_TRANSFORM_TOKEN } from './entry-point/write-package.di';
import { entryPointTransformFactory } from './entry-point.transform';

export const ENTRY_POINT_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.entryPointTransform`);

export const ENTRY_POINT_TRANSFORM: TransformProvider = provideTransform({
  provide: ENTRY_POINT_TRANSFORM_TOKEN,
  useFactory: entryPointTransformFactory,
  deps: [STYLESHEET_TRANSFORM_TOKEN, COMPILE_NGC_TOKEN, WRITE_BUNDLES_TRANSFORM_TOKEN, WRITE_PACKAGE_TRANSFORM_TOKEN]
});

export const ENTRY_POINT_PROVIDERS: Provider[] = [
  ENTRY_POINT_TRANSFORM,
  STYLESHEET_TRANSFORM,
  COMPILE_NGC_TRANSFORM,
  WRITE_BUNDLES_TRANSFORM,
  WRITE_PACKAGE_TRANSFORM
];
