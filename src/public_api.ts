/**
 * Commands API
 */
export * from './lib/commands/command';
export * from './lib/commands/build.command';
export * from './lib/commands/version.command';

/**
 * ngPackagr() programmatic API
 */
export { BuildGraph, Traversable } from './lib/brocc/build-graph';
export { Node, NodeState, STATE_DIRTY, STATE_DONE, STATE_IN_PROGESS, STATE_PENDING } from './lib/brocc/node';
export { and, by, isDirty, isDone, isInProgress, isPending } from './lib/brocc/select';
export { Transform, transformFromPromise, PromiseBasedTransform } from './lib/brocc/transform';
export { NgPackagr, ngPackagr } from './lib/ng-v5/packagr';
export { forEachStylesheet, ForEachStylesheetFn } from './lib/ng-v5/entry-point/resources/stylesheet.transform';

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

/**
 * Deprecations that are going to be removed in v3.
 */
export * from './lib/deprecations';
