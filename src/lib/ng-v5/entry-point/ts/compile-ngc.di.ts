import { InjectionToken, FactoryProvider } from 'injection-js';
import { Transform } from '../../../brocc/transform';
import { TransformProvider, provideTransform } from '../../../brocc/transform.di';
import { compileNgcTransform } from './compile-ngc.transform';

export const COMPILE_NGC_TOKEN = new InjectionToken<Transform>(`ng.v5.compileNgcTransform`);

export const COMPILE_NGC_TRANSFORM: TransformProvider = provideTransform({
  provide: COMPILE_NGC_TOKEN,
  useFactory: () => compileNgcTransform
});
