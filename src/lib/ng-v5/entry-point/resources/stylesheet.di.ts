import { InjectionToken, FactoryProvider } from 'injection-js';
import { Transform } from '../../../brocc/transform';
import { TransformProvider, provideTransform } from '../../../brocc/transform.di';
import { stylesheetTransform } from './stylesheet.transform';

export const STYLESHEET_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.stylesheetTransform`);

export const STYLESHEET_TRANSFORM: TransformProvider = provideTransform({
  provide: STYLESHEET_TRANSFORM_TOKEN,
  useFactory: () => stylesheetTransform
});
