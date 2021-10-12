import { InjectionToken } from 'injection-js';
import { Transform } from '../../graph/transform';
import { TransformProvider, provideTransform } from '../../graph/transform.di';
import { OPTIONS_TOKEN } from '../options.di';
import { writePackageTransform } from './write-package.transform';

export const WRITE_PACKAGE_TRANSFORM_TOKEN = new InjectionToken<Transform>(`ng.v5.writePackageTransform`);

export const WRITE_PACKAGE_TRANSFORM: TransformProvider = provideTransform({
  provide: WRITE_PACKAGE_TRANSFORM_TOKEN,
  useFactory: writePackageTransform,
  deps: [OPTIONS_TOKEN],
});
