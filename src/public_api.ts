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
