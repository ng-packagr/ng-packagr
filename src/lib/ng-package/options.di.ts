import { InjectionToken, ValueProvider, Provider } from 'injection-js';

export const OPTIONS_TOKEN = new InjectionToken<NgPackagrOptions>(`ng.v5.options`);
export interface NgPackagrOptions {
  /** Whether or not ng-packagr will watch for file changes and perform an incremental build. */
  watch?: boolean;
  watchOptions?: {
    /** ng-packagr will ignore watching these file changes */
    ignored?: string[];
  }
}

export const provideOptions = (options: NgPackagrOptions = {}): ValueProvider => ({
  provide: OPTIONS_TOKEN,
  useValue: options,
});

export const DEFAULT_OPTIONS_PROVIDER: Provider = provideOptions();
