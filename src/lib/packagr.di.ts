import type { ParsedConfiguration } from '@angular/compiler-cli';
import { FactoryProvider, InjectionToken, Provider, ValueProvider } from 'injection-js';
import { Transform } from './graph/transform';
import { analyseSourcesTransform } from './ng-package/entry-point/analyse-sources.transform';
import { compileNgcTransformFactory } from './ng-package/entry-point/compile-ngc.transform';
import { entryPointTransformFactory } from './ng-package/entry-point/entry-point.transform';
import { initTsConfigTransformFactory } from './ng-package/entry-point/init-tsconfig.transform';
import { writeBundlesTransform } from './ng-package/entry-point/write-bundles.transform';
import { writePackageTransform } from './ng-package/entry-point/write-package.transform';
import { NgPackagrOptions, normalizeOptions } from './ng-package/options';
import { packageTransformFactory } from './ng-package/package.transform';
import { StylesheetProcessor } from './styles/stylesheet-processor';

/**
 * A specialized `FactoryProvider` for a `Transform`.
 */
export interface TransformProvider extends FactoryProvider {
  /**
   * An injection token for the `Transform` provided by this provider.
   */
  provide: InjectionToken<Transform>;

  /**
   * A function to invoke to create the `Transform`.
   *
   * The factory function is invoked with resolved values of tokens in the `deps` field.
   */
  useFactory: (...args: any[]) => Transform;
}

/**
 * Creates a provider for a `Transform`.
 *
 * #### Example
 *
 * Creating a transformation `fooBar` that is composed of `foo` and `bar` transforms:
 *
 * ```ts
 * const FOO_BAR_TOKEN = new InjectionToken<Transform>('fooBar');
 *
 * const FOO_BAR_TRANSFORM = provideTransform({
 *   provide: FOO_BAR_TOKEN,
 *   useFactory: (foo, bar) => {
 *     return pipe(foo, bar);
 *   },
 *   deps: [ FOO_TOKEN, BAR_TOKEN ]
 * });
 * ```
 *
 * @param module The provider for the transform
 * @return A (normalized) provider for the transform
 */
export function provideTransform(module: TransformProvider): TransformProvider {
  return {
    ...module,
    deps: module.deps || [],
  };
}

/** DI Token for the project parameter */
export const PROJECT_TOKEN = new InjectionToken<string>(`ng.v5.project`);

/** DI Provider for the project parameter */
export const provideProject = (project: string): ValueProvider => ({
  provide: PROJECT_TOKEN,
  useValue: project,
});

/** DI Token for {@link NgPackagrOptions} */
export const OPTIONS_TOKEN = new InjectionToken<NgPackagrOptions>(`ng.v5.options`);

/** DI Provider for {@link NgPackagrOptions} */
export const provideOptions = (options: NgPackagrOptions = {}): ValueProvider => ({
  provide: OPTIONS_TOKEN,
  useValue: normalizeOptions(options),
});

/** DI Provider for default {@link NgPackagrOptions} */
export const DEFAULT_OPTIONS_PROVIDER: Provider = provideOptions();

/** DI Token for the {@link Transform} of the full library package */
export const provideTsConfig = (values?: ParsedConfiguration | string): Provider => {
  return {
    provide: DEFAULT_TS_CONFIG_TOKEN,
    useValue: values,
  };
};

export const DEFAULT_TS_CONFIG_TOKEN = new InjectionToken<ParsedConfiguration | string | undefined>(
  'ng.v5.defaultTsConfig',
);

export const INIT_TS_CONFIG_TOKEN = new InjectionToken<Transform>('ng.v5.initTsConfigTransform');

export const INIT_TS_CONFIG_TRANSFORM: TransformProvider = provideTransform({
  provide: INIT_TS_CONFIG_TOKEN,
  useFactory: initTsConfigTransformFactory,
  deps: [DEFAULT_TS_CONFIG_TOKEN],
});

/** DI Token for the {@link Transform} that analyses sources (source discovery) */
export const ANALYSE_SOURCES_TOKEN = new InjectionToken<Transform>(`ng.v5.analyseSourcesTransform`);

/** DI Provider for the {@link Transform} that analyses sources (source discovery) */
export const ANALYSE_SOURCES_TRANSFORM: TransformProvider = provideTransform({
  provide: ANALYSE_SOURCES_TOKEN,
  useFactory: () => analyseSourcesTransform,
});

/** DI Token for the {@link StylesheetProcessor} */
export const STYLESHEET_PROCESSOR_TOKEN = new InjectionToken<StylesheetProcessor>(`ng.v5.stylesheetProcessor`);

/** DI Provider for the {@link StylesheetProcessor} */
export const STYLESHEET_PROCESSOR: FactoryProvider = {
  provide: STYLESHEET_PROCESSOR_TOKEN,
  useFactory: () => StylesheetProcessor,
  deps: [],
};

/** DI Token for the {@link Transform} that ngc/tsc compilation */
export const COMPILE_NGC_TOKEN = new InjectionToken<Transform>(`ng.v5.compileNgcTransform`);

/** DI Provider for the {@link Transform} that ngc/tsc compilation */
export const COMPILE_NGC_TRANSFORM: TransformProvider = provideTransform({
  provide: COMPILE_NGC_TOKEN,
  useFactory: compileNgcTransformFactory,
  deps: [STYLESHEET_PROCESSOR_TOKEN, OPTIONS_TOKEN],
});

/** DI Providers to the global injector scope */
export const COMPILE_NGC_PROVIDERS: Provider[] = [STYLESHEET_PROCESSOR, COMPILE_NGC_TRANSFORM];

export const WRITE_BUNDLES_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.writeBundlesTransform`);

export const WRITE_BUNDLES_TRANSFORM: TransformProvider = provideTransform({
  provide: WRITE_BUNDLES_TRANSFORM_TOKEN,
  useFactory: writeBundlesTransform,
  deps: [OPTIONS_TOKEN],
});

export const WRITE_PACKAGE_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.writePackageTransform`);

export const WRITE_PACKAGE_TRANSFORM: TransformProvider = provideTransform({
  provide: WRITE_PACKAGE_TRANSFORM_TOKEN,
  useFactory: writePackageTransform,
  deps: [OPTIONS_TOKEN],
});

/** DI Token for the {@link Transform} compiling an entry point */
export const ENTRY_POINT_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.entryPointTransform`);

/** DI Provider for the {@link Transform} compiling an entry point */
export const ENTRY_POINT_TRANSFORM: TransformProvider = provideTransform({
  provide: ENTRY_POINT_TRANSFORM_TOKEN,
  useFactory: entryPointTransformFactory,
  deps: [COMPILE_NGC_TOKEN, WRITE_BUNDLES_TRANSFORM_TOKEN, WRITE_PACKAGE_TRANSFORM_TOKEN],
});

/** DI Providers added to the global injector scope */
export const ENTRY_POINT_PROVIDERS: Provider[] = [
  ENTRY_POINT_TRANSFORM,
  ...COMPILE_NGC_PROVIDERS,
  WRITE_BUNDLES_TRANSFORM,
  WRITE_PACKAGE_TRANSFORM,
];

/** DI Token for the {@link Transform} of the full library package */
export const PACKAGE_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.packageTransform`);

/** DI Provider for the {@link Transform} of the full library package */
export const PACKAGE_TRANSFORM: TransformProvider = provideTransform({
  provide: PACKAGE_TRANSFORM_TOKEN,
  useFactory: packageTransformFactory,
  deps: [PROJECT_TOKEN, OPTIONS_TOKEN, INIT_TS_CONFIG_TOKEN, ANALYSE_SOURCES_TOKEN, ENTRY_POINT_TRANSFORM_TOKEN],
});

/** DI Providers to be added to the global injection-js scope */
export const PACKAGE_PROVIDERS: Provider[] = [
  PACKAGE_TRANSFORM,
  DEFAULT_OPTIONS_PROVIDER,
  INIT_TS_CONFIG_TRANSFORM,
  ANALYSE_SOURCES_TRANSFORM,
];
