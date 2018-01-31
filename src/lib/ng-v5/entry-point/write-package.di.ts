import { InjectionToken, ValueProvider } from 'injection-js';
import { Transform } from '../../brocc/transform';
import { TransformProvider, provideTransform } from '../../brocc/transform.di';
import { writePackageTransform } from './write-package.transform';

export const WRITE_PACKAGE_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.writePackageTransform`);

export const WRITE_PACKAGE_TRANSFORM: TransformProvider = provideTransform({
  provide: WRITE_PACKAGE_TRANSFORM_TOKEN,
  useFactory: () => writePackageTransform
});
