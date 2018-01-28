import { InjectionToken, FactoryProvider } from 'injection-js';
import { Transform } from '../brocc/transform';
import { TransformProvider, provideTransform } from '../brocc/transform.di';
import { PROJECT_TOKEN } from './project.di';
import { ENTRY_POINT_TRANSFORM_TOKEN } from './entry-point.di';
import { packageTransformFactory } from './package.transform';

export const PACKAGE_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.packageTransform`);

export const PACKAGE_TRANSFORM = provideTransform({
  provide: PACKAGE_TRANSFORM_TOKEN,
  useFactory: packageTransformFactory,
  deps: [PROJECT_TOKEN, ENTRY_POINT_TRANSFORM_TOKEN]
});
