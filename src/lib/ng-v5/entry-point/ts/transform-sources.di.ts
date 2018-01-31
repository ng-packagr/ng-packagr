import { InjectionToken, FactoryProvider } from 'injection-js';
import { Transform } from '../../../brocc/transform';
import { TransformProvider, provideTransform } from '../../../brocc/transform.di';
import { transformSourcesTransform } from './transform-sources.transform';

export const TRANSFORM_SOURCES_TOKEN = new InjectionToken<Transform>(`ng.v5.transformSourcesTransform`);

export const TRANSFORM_SOURCES_TRANSFORM: TransformProvider = provideTransform({
  provide: TRANSFORM_SOURCES_TOKEN,
  useFactory: () => transformSourcesTransform
});
