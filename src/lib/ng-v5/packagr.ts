import { ParsedConfiguration } from '@angular/compiler-cli';
import { InjectionToken, Provider, ReflectiveInjector } from 'injection-js';
import { of as observableOf } from 'rxjs/observable/of';
import { take, map, catchError } from 'rxjs/operators';
import { BuildGraph } from '../brocc/build-graph';
import { Transform } from '../brocc/transform';
import { TsConfig } from '../ts/tsconfig';
import * as log from '../util/log';
import { provideTsConfig } from './init/init-tsconfig.di';
import { ENTRY_POINT_PROVIDERS } from './entry-point.di';
import { PACKAGE_TRANSFORM, PACKAGE_PROVIDERS } from './package.di';
import { provideProject } from './project.di';

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
  public withTsConfig(defaultValues: TsConfig | string): NgPackagr {
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
    const injector = ReflectiveInjector.resolveAndCreate(this.providers);
    const buildTransformOperator = injector.get(this.buildTransform);

    return observableOf(new BuildGraph())
      .pipe(
        buildTransformOperator,
        take(1),
        catchError(err => {
          // Report error and re-throw to subscribers
          log.error(err);
          throw err;
        }),
        map(() => {})
      )
      .toPromise();
  }
}

export const ngPackagr = (): NgPackagr =>
  new NgPackagr([
    // Add default providers to this list.
    ...PACKAGE_PROVIDERS,
    ...ENTRY_POINT_PROVIDERS
  ]);
