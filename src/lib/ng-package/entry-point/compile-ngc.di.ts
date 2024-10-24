import { InjectionToken, Provider } from 'injection-js';
import { EntryPointTransformProvider, provideEntryPointTransform } from '../../graph/entry-point-transform.di';
import { Transform } from '../../graph/transform';
import { STYLESHEET_PROCESSOR, STYLESHEET_PROCESSOR_TOKEN } from '../../styles/stylesheet-processor.di';
import { OPTIONS_TOKEN } from '../options.di';
import { compileNgcTransformFactory } from './compile-ngc.transform';

export const COMPILE_NGC_TOKEN = new InjectionToken<Transform>(`ng.v5.compileNgcTransform`);

export const COMPILE_NGC_TRANSFORM: EntryPointTransformProvider = provideEntryPointTransform({
  provide: COMPILE_NGC_TOKEN,
  useFactory: compileNgcTransformFactory,
  deps: [
    STYLESHEET_PROCESSOR_TOKEN,
    OPTIONS_TOKEN,
  ],
});

export const COMPILE_NGC_PROVIDERS: Provider[] = [STYLESHEET_PROCESSOR, COMPILE_NGC_TRANSFORM];
