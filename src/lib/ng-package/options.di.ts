import { InjectionToken, ValueProvider, Provider } from 'injection-js';

export const OPTIONS_TOKEN = new InjectionToken<NgPackagrOptions>(`ng.v5.options`);

export interface NgPackagrWatchOptions {
  /** ng-packagr will ignore watching these file changes */
  ignored?: RegExp | string | string[];
}

export interface NgPackagrOptions {
  /** Whether or not ng-packagr will watch for file changes and perform an incremental build. */
  watch?: boolean;
  watchOptions?: NgPackagrWatchOptions
}

export const provideOptions = (options: NgPackagrOptions = {}): ValueProvider => ({
  provide: OPTIONS_TOKEN,
  useValue: options,
});

export const DEFAULT_OPTIONS_PROVIDER: Provider = provideOptions();
