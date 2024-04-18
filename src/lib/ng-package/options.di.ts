import findCacheDirectory from 'find-cache-dir';
import { InjectionToken, Provider, ValueProvider } from 'injection-js';
import { tmpdir } from 'os';
import { resolve } from 'path';

export const OPTIONS_TOKEN = new InjectionToken<NgPackagrOptions>(`ng.v5.options`);
export interface NgPackagrOptions {
  /** Whether or not ng-packagr will watch for file changes and perform an incremental build. */
  watch?: boolean;
  cacheEnabled?: boolean;
  cacheDirectory?: string;
  poll?: number;
}

export const provideOptions = (options: NgPackagrOptions = {}): ValueProvider => ({
  provide: OPTIONS_TOKEN,
  useValue: normalizeOptions(options),
});

export const DEFAULT_OPTIONS_PROVIDER: Provider = provideOptions();

function normalizeOptions(options: NgPackagrOptions = {}) {
  const ciEnv = process.env['CI'];
  const isCI = ciEnv?.toLowerCase() === 'true' || ciEnv === '1';
  const { cacheEnabled = !isCI, cacheDirectory = findCachePath() } = options;

  return {
    ...options,
    cacheEnabled,
    cacheDirectory,
  };
}

function findCachePath(): string {
  const name = 'ng-packagr';

  return findCacheDirectory({ name }) || resolve(tmpdir(), name);
}
