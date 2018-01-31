import { InjectionToken, FactoryProvider } from 'injection-js';

export interface TransformProvider extends FactoryProvider {
  provide: InjectionToken<any>;
  deps?: any[];
}

export function provideTransform(module: TransformProvider): TransformProvider {
  return {
    ...module,
    deps: module.deps || []
  };
}
