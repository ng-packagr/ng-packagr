import { InjectionToken, Provider, ReflectiveInjector } from 'injection-js';
import { ParsedConfiguration } from '@angular/compiler-cli';
import { of as observableOf, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BuildGraph } from '../brocc/build-graph';
import { Transform } from '../brocc/transform';
import * as log from '../util/log';
import { provideTsConfig } from './init/init-tsconfig.di';
import { ENTRY_POINT_PROVIDERS } from './entry-point.di';
import { PACKAGE_TRANSFORM, PACKAGE_PROVIDERS } from './package.di';
import { provideProject } from './project.di';
import { provideOptions, NgPackagrOptions } from './options.di';

/**
 * The original ng-packagr implemented on top of a rxjs-ified and di-jectable transformation pipeline.
 *
 * See the `docs/transformations.md` for more prose description.
 *
 * @link https://github.com/dherges/ng-packagr/pull/572
 */
export class NgPackagr {
  private buildTransform: InjectionToken<Transform> = PACKAGE_TRANSFORM.provide;

  constructor(private providers: Provider[]) {}

  /**
   * Adds options to ng-packagr
   *
   * @param options Ng Packagr Options
   * @return Self instance for fluent API
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
   * @return Self intance for fluent API
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
  public build(): Promise<void> {
    return this.buildAsObservable().toPromise();
  }

  /**
   * Builds and watch for changes by kick-starting the 'watch' transform over an (initially) empty `BuildGraph``
   *
   * @return An observable result of the transformation pipeline.
   */
  public watch(): Observable<void> {
    this.providers.push(provideOptions({ watch: true }));

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

    return observableOf(new BuildGraph()).pipe(
      buildTransformOperator,
      catchError(err => {
        // Report error and re-throw to subscribers
        log.error(err);
        return throwError(err);
      }),
      map(() => undefined)
    );
  }
}

export const ngPackagr = (): NgPackagr =>
  new NgPackagr([
    // Add default providers to this list.
    ...PACKAGE_PROVIDERS,
    ...ENTRY_POINT_PROVIDERS
  ]);
