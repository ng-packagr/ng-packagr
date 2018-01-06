import { InjectionToken, Provider, ReflectiveInjector, ValueProvider } from 'injection-js';
import { buildNgPackage } from '../steps/build-ng-package';

export class NgPackagr {

  constructor(
    private providers: Provider[]
  ) {}

  public withProviders(providers: Provider[]): NgPackagr {
    this.providers = [
      ...this.providers,
      ...providers
    ];

    return this;
  }

  public build(): Promise<void> {
    const injector = ReflectiveInjector.resolveAndCreate(this.providers);
    const project = injector.get(PROJECT_TOKEN);

    return buildNgPackage({ project });
  }

}

export const ngPackagr = (): NgPackagr => new NgPackagr([
  // TODO: default providers come here
]);

export const PROJECT_TOKEN = new InjectionToken<string>('ng.v5.project');

export const provideProject = (project: string): ValueProvider => ({
  provide: PROJECT_TOKEN,
  useValue: project
});
