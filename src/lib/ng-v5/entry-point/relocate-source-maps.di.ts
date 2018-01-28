import { InjectionToken, ValueProvider } from 'injection-js';
import { Transform } from '../../brocc/transform';
import { TransformProvider, provideTransform } from '../../brocc/transform.di';
import { relocateSourceMapsTransform } from './relocate-source-maps.transform';

export const RELOCATE_SOURCE_MAPS_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.relocateSourceMapsTransform`);

export const RELOCATE_SOURCE_MAPS_TRANSFORM: TransformProvider = provideTransform({
  provide: RELOCATE_SOURCE_MAPS_TRANSFORM_TOKEN,
  useFactory: () => relocateSourceMapsTransform
});
