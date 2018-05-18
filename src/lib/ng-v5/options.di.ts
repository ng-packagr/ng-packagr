import { InjectionToken, ValueProvider, Provider } from 'injection-js';
import { Transform } from '../brocc/transform';
import { TransformProvider, provideTransform } from '../brocc/transform.di';

export const OPTIONS_TOKEN = new InjectionToken<NgPackagrOptions>(`ng.v5.options`);
export interface NgPackagrOptions {
  /** Weather or not ng-packagr will watch for file changes and perform an incremental build */
  watch?: boolean;
}

export const provideOptions = (options: NgPackagrOptions = {}): ValueProvider => ({
  provide: OPTIONS_TOKEN,
  useValue: options
});

export const DEFAULT_OPTIONS_PROVIDER: Provider = provideOptions();
