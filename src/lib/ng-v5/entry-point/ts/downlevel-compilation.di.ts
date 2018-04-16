import { InjectionToken } from 'injection-js';
import { Transform } from '../../../brocc/transform';
import { TransformProvider, provideTransform } from '../../../brocc/transform.di';
import { downlevelCompileTransform } from './downlevel-compilation';

export const DOWNLEVEL_COMPILATION_TOKEN = new InjectionToken<Transform>(`ng.v5.downlevelCompilation`);

export const DOWNLEVEL_COMPILATION_TRANSFORM: TransformProvider = provideTransform({
  provide: DOWNLEVEL_COMPILATION_TOKEN,
  useFactory: () => downlevelCompileTransform
});
