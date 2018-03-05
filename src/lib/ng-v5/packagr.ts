import { ParsedConfiguration } from '@angular/compiler-cli';
import { InjectionToken, Provider, ReflectiveInjector, ValueProvider } from 'injection-js';
import { of as observableOf } from 'rxjs/observable/of';
import { take, map, catchError } from 'rxjs/operators';
import { BuildGraph } from '../brocc/build-graph';
import { Node } from '../brocc/node';
import { Transform } from '../brocc/transform';
import { provideTransform, TransformProvider } from '../brocc/transform.di';
import { TsConfig } from '../ts/tsconfig';
import * as log from '../util/log';
import { provideTsConfig, DEFAULT_TS_CONFIG_TOKEN, INIT_TS_CONFIG_TOKEN } from './init/init-tsconfig.di';
import { ENTRY_POINT_TRANSFORM, ENTRY_POINT_PROVIDERS } from './entry-point.di';
import { PACKAGE_TRANSFORM, PACKAGE_PROVIDERS, PACKAGE_TRANSFORM_TOKEN } from './package.di';
import { provideProject } from './project.di';
import { STYLESHEET_TRANSFORM_TOKEN } from './entry-point/resources/stylesheet.di';
import { TEMPLATE_TRANSFORM_TOKEN } from './entry-point/resources/template.di';

/**
 * The original ng-packagr implemented on top of a rxjs-ified and di-jectable transformation pipeline.
 *
 * See the `docs/transformations.md` for more prose description.
 *
 * @link https://github.com/dherges/ng-packagr/pull/572
 */
export class NgPackagr {
  private intialTransform: InjectionToken<Transform> = PACKAGE_TRANSFORM.provide;

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

  public withTsConfigTransform(transform: Transform): NgPackagr {
    this.providers.push(
      provideTransform({
        provide: INIT_TS_CONFIG_TOKEN,
        useFactory: () => transform
      })
    );

    return this;
  }

  public withStylesheetTransform(transform: Transform): NgPackagr {
    this.providers.push(
      provideTransform({
        provide: STYLESHEET_TRANSFORM_TOKEN,
        useFactory: () => transform
      })
    );

    return this;
  }

  public withTemplateTransform(transform: Transform): NgPackagr {
    this.providers.push(
      provideTransform({
        provide: TEMPLATE_TRANSFORM_TOKEN,
        useFactory: () => transform
      })
    );

    return this;
  }

  /**
   * Overwrites the 'build' transform.
   *
   * @deprecated Use `build(initialTransform: InjectionToken<Transform>)` instead!
   * @param transform
   * @return Self intance for fluent API
   */
  withBuildTransform(transform: InjectionToken<Transform>): NgPackagr {
    log.warn('DEPRECATION: Please use `.build(initialTransform?: InjectionToken<Transform>)` instead!');
    this.intialTransform = transform;

    return this;
  }

  /**
   * Builds the project by kick-starting the 'build' transform over an (initially) empty `BuildGraph``
   *
   * @return A promisified result of the transformation pipeline.
   */
  public build(initialTransform?: InjectionToken<Transform>): Promise<void> {
    const injector = ReflectiveInjector.resolveAndCreate(this.providers);

    let buildTransformOperator: Transform;
    if (initialTransform) {
      buildTransformOperator = injector.get(initialTransform);
    } else {
      buildTransformOperator = injector.get(this.intialTransform);
    }

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
