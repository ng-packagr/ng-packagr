/**
 * Commands API
 */
export * from './lib/commands/command';
export * from './lib/commands/build.command';
export * from './lib/commands/version.command';

/**
 * ngPackagr() programmatic API
 */
export * from './lib/ng-v5/packagr';

/**
 * Angular-specifics for tsc and ngc
 */
export { compileSourceFiles } from './lib/ngc/compile-source-files';
export { transformSourceFiles } from './lib/ngc/transform-source-files';
export {
  TemplateTransformer,
  StylesheetTransformer,
  ComponentSourceFileTransformer,
  transformComponentSourceFiles
} from './lib/ts/ng-component-transformer';
export { isComponentDecorator, isStyleUrls, isTemplateUrl } from './lib/ts/ng-ts-ast';
export { ComponentTransformer, transformComponent } from './lib/ts/transform-component';
