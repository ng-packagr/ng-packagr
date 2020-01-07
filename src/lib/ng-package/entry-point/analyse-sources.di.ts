import { InjectionToken } from 'injection-js';
import { Transform } from '../../graph/transform';
import { TransformProvider, provideTransform } from '../../graph/transform.di';
import { analyseSourcesTransform } from './analyse-sources.transform';

export const ANALYSE_SOURCES_TOKEN = new InjectionToken<Transform>(`ng.v5.analyseSourcesTransform`);

export const ANALYSE_SOURCES_TRANSFORM: TransformProvider = provideTransform({
  provide: ANALYSE_SOURCES_TOKEN,
  useFactory: () => analyseSourcesTransform,
});
