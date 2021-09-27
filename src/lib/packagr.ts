import { InjectionToken, Provider, ReflectiveInjector } from 'injection-js';
import type { ParsedConfiguration } from '@angular/compiler-cli';
import { of as observableOf, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { BuildGraph } from './graph/build-graph';
import { Transform } from './graph/transform';
import { provideTsConfig } from './ng-package/entry-point/init-tsconfig.di';
import { ENTRY_POINT_PROVIDERS } from './ng-package/entry-point/entry-point.di';
import { PACKAGE_TRANSFORM, PACKAGE_PROVIDERS } from './ng-package/package.di';
import { provideProject } from './project.di';
import { provideOptions, NgPackagrOptions } from './ng-package/options.di';

/**
 * The original ng-packagr implemented on top of a rxjs-ified and di-jectable transformation pipeline.
 *
 * See the `docs/transformations.md` for more prose description.
 *
 * @link https://github.com/ng-packagr/ng-packagr/pull/572
 */
export class NgPackagr {
  private buildTransform: InjectionToken<Transform> = PACKAGE_TRANSFORM.provide;

  constructor(private providers: Provider[]) {}

  /**
   * Adds options to ng-packagr
   *
   * @param options Ng Packagr Options
   * @return Self instance for fluent API
   * @deprecated use the options parameter in 'build' and 'watch' methods
   */
  public withOptions(options: NgPackagrOptions): NgPackagr {
    this.providers.push(provideOptions(options));

    return this;
  }

  /**
   * Sets the path to the user's "ng-package" file (either `package.json`, `ng-package.json`, or `ng-package.js`)
   *
   * @param project File path
   * @return Self instance for fluent API
   */
  public forProject(project: string): NgPackagr {
    this.providers.push(provideProject(project));

    return this;
  }

  /**
   * Adds dependency injection providers.
   *
   * @param providers
   * @return Self instance for fluent API
   * @link https://github.com/mgechev/injection-js
   */
  public withProviders(providers: Provider[]): NgPackagr {
    this.providers = [...this.providers, ...providers];

    return this;
  }

  /**
   * Overwrites the default TypeScript configuration.
   *
   * @param defaultValues A tsconfig providing default values to the compilation.
   * @return Self instance for fluent API
   */
  public withTsConfig(defaultValues: ParsedConfiguration | string): NgPackagr {
    this.providers.push(provideTsConfig(defaultValues));

    return this;
  }

  /**
   * Overwrites the 'build' transform.
   *
   * @param transform
   * @return Self instance for fluent API
   */
  public withBuildTransform(transform: InjectionToken<Transform>): NgPackagr {
    this.buildTransform = transform;

    return this;
  }

  /**
   * Builds the project by kick-starting the 'build' transform over an (initially) empty `BuildGraph``
   *
   * @return A promisified result of the transformation pipeline.
   */
  public build(options: NgPackagrOptions = {}): Promise<void> {
    this.providers.push(provideOptions({ ...options, watch: false }));
    return this.buildAsObservable().toPromise();
  }

  /**
   * Builds and watch for changes by kick-starting the 'watch' transform over an (initially) empty `BuildGraph``
   *
   * @return An observable result of the transformation pipeline.
   */
  public watch(options: NgPackagrOptions = {}): Observable<void> {
    this.providers.push(provideOptions({ ...options, watch: true }));

    return this.buildAsObservable();
  }

  /**
   * Builds the project by kick-starting the 'build' transform over an (initially) empty `BuildGraph``
   *
   * @return An observable result of the transformation pipeline.
   */
  public buildAsObservable(): Observable<void> {
    const injector = ReflectiveInjector.resolveAndCreate(this.providers);
    const buildTransformOperator = injector.get(this.buildTransform);

    return observableOf(new BuildGraph()).pipe(buildTransformOperator, mapTo(undefined));
  }
}

export const ngPackagr = (): NgPackagr =>
  new NgPackagr([
    // Add default providers to this list.
    ...PACKAGE_PROVIDERS,
    ...ENTRY_POINT_PROVIDERS,
  ]);
