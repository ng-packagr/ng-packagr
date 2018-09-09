import { Command } from './command';
import { ngPackagr } from '../ng-v5/packagr';

/**
 * CLI arguments passed to `ng-packagr` executable and `build()` command.
 *
 * @stable
 */
export interface CliArguments {
  /** Path to the project file 'package.json', 'ng-package.json', or 'ng-package.js'. */
  project: string;
  /** Whether or not ng-packagr will watch for file changes and perform an incremental build. */
  watch?: boolean;
  /** Path to a tsconfig file. */
  config?: string;
}

/**
 * Command running an "one-off" build.
 *
 * @stable
 */
export const build: Command<CliArguments, void> = opts =>
  ngPackagr()
    .forProject(opts.project)
    .withOptions({ watch: opts.watch })
    .withTsConfig(opts.config)
    .build();
