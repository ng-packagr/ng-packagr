import { InjectionToken } from 'injection-js';
import { EntryPointTransformProvider, provideEntryPointTransform } from '../../graph/entry-point-transform.di';
import { Transform } from '../../graph/transform';
import { OPTIONS_TOKEN } from '../options.di';
import { writeBundlesTransform } from './write-bundles.transform';

export const WRITE_BUNDLES_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.writeBundlesTransform`);

export const WRITE_BUNDLES_TRANSFORM: EntryPointTransformProvider = provideEntryPointTransform({
  provide: WRITE_BUNDLES_TRANSFORM_TOKEN,
  useFactory: writeBundlesTransform,
  deps: [OPTIONS_TOKEN],
});
