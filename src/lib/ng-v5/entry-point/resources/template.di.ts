import { InjectionToken, FactoryProvider } from 'injection-js';
import { Transform } from '../../../brocc/transform';
import { TransformProvider, provideTransform } from '../../../brocc/transform.di';
import { templateTransform } from './template.transform';

export const TEMPLATE_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.templateTransform`);

export const TEMPLATE_TRANSFORM: TransformProvider = provideTransform({
  provide: TEMPLATE_TRANSFORM_TOKEN,
  useFactory: () => templateTransform
});
