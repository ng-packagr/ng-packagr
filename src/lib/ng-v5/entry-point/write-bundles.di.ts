import { InjectionToken, ValueProvider } from 'injection-js';
import { Transform } from '../../brocc/transform';
import { TransformProvider, provideTransform } from '../../brocc/transform.di';
import { writeBundlesTransform } from './write-bundles.transform';

export const WRITE_BUNDLES_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.writeBundlesTransform`);

export const WRITE_BUNDLES_TRANSFORM: TransformProvider = provideTransform({
  provide: WRITE_BUNDLES_TRANSFORM_TOKEN,
  useFactory: () => writeBundlesTransform
});
