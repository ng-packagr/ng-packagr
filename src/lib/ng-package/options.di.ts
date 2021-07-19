import { InjectionToken, ValueProvider, Provider } from 'injection-js';

export const OPTIONS_TOKEN = new InjectionToken<NgPackagrOptions>(`ng.v5.options`);
export interface NgPackagrOptions {
  /** Whether or not ng-packagr will watch for file changes and perform an incremental build. */
  watch?: boolean;
  /** Files to be ignored by that watcher so they don't trigger rebuilds  */
  ignoredPaths?: (RegExp | string)[];
}

export const provideOptions = (options: NgPackagrOptions = {}): ValueProvider => ({
  provide: OPTIONS_TOKEN,
  useValue: options,
});

export const DEFAULT_OPTIONS_PROVIDER: Provider = provideOptions();
