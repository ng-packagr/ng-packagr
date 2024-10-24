import { FactoryProvider, InjectionToken } from 'injection-js';
import { EntryPointTransform } from './entry-point-transform';

/**
 * A specialized `FactoryProvider` for a `EntryPointTransform`.
 */
export interface EntryPointTransformProvider extends FactoryProvider {
  /**
   * An injection token for the `EntryPointTransform` provided by this provider.
   */
  provide: InjectionToken<EntryPointTransform>;

  /**
   * A function to invoke to create the `EntryPointTransform`.
   *
   * The factory function is invoked with resolved values of tokens in the `deps` field.
   */
  useFactory: (...args: any[]) => EntryPointTransform;
}

/**
 * Creates a provider for a `EntryPointTransform`.
 * @param module The provider for the transform
 * @return A (normalized) provider for the transform
 */
export function provideEntryPointTransform(module: EntryPointTransformProvider): EntryPointTransformProvider {
  return {
    ...module,
    deps: module.deps || [],
  };
}
