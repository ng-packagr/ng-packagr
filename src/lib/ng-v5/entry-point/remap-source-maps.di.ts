import { InjectionToken } from 'injection-js';
import { Transform } from '../../brocc/transform';
import { TransformProvider, provideTransform } from '../../brocc/transform.di';
import { remapSourceMapsTransform } from './remap-source-maps.transform';

export const REMAP_SOURCE_MAPS_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.remapSourceMapsTransform`);

export const REMAP_SOURCE_MAPS_TRANSFORM: TransformProvider = provideTransform({
  provide: REMAP_SOURCE_MAPS_TRANSFORM_TOKEN,
  useFactory: () => remapSourceMapsTransform
});
