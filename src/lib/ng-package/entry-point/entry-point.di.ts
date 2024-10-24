import { InjectionToken, Provider } from 'injection-js';
import { EntryPointTransformProvider, provideEntryPointTransform } from '../../graph/entry-point-transform.di';
import { Transform } from '../../graph/transform';
import { COMPILE_NGC_PROVIDERS, COMPILE_NGC_TOKEN } from './compile-ngc.di';
import { entryPointTransformFactory } from './entry-point.transform';
import { WRITE_BUNDLES_TRANSFORM, WRITE_BUNDLES_TRANSFORM_TOKEN } from './write-bundles.di';
import { WRITE_PACKAGE_TRANSFORM, WRITE_PACKAGE_TRANSFORM_TOKEN } from './write-package.di';

export const ENTRY_POINT_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.entryPointTransform`);

export const ENTRY_POINT_TRANSFORM: EntryPointTransformProvider = provideEntryPointTransform({
  provide: ENTRY_POINT_TRANSFORM_TOKEN,
  useFactory: entryPointTransformFactory,
  deps: [COMPILE_NGC_TOKEN, WRITE_BUNDLES_TRANSFORM_TOKEN, WRITE_PACKAGE_TRANSFORM_TOKEN],
});

export const ENTRY_POINT_PROVIDERS: Provider[] = [
  ENTRY_POINT_TRANSFORM,
  ...COMPILE_NGC_PROVIDERS,
  WRITE_BUNDLES_TRANSFORM,
  WRITE_PACKAGE_TRANSFORM,
];
