import { Logger, process as mainNgcc, LogLevel } from '@angular/compiler-cli/ngcc';
import { existsSync, constants, accessSync } from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { NgccProcessingCache } from '../ng-package/ngcc-cache';
import * as log from '../utils/log';
import { EntryPointNode, ngUrl } from '../ng-package/nodes';

// Transform a package and its typings when NGTSC is resolving a module.
export class NgccProcessor {
  private _logger: NgccLogger;
  private _nodeModulesDirectory: string;
  private _entryPointsUrl: string[];

  constructor(
    private readonly ngccProcessingCache: NgccProcessingCache,
    private readonly projectPath: string,
    private readonly compilerOptions: ts.CompilerOptions,
    private readonly entryPoints: EntryPointNode[],
  ) {
    this._entryPointsUrl = this.entryPoints.map(({ url }) => ngUrl(url));

    const { baseUrl } = this.compilerOptions;
    this._nodeModulesDirectory = this.findNodeModulesDirectory(baseUrl);
  }

  processModule(moduleName: string, resolvedModule: ts.ResolvedModule | ts.ResolvedTypeReferenceDirective): void {
    const resolvedFileName = resolvedModule.resolvedFileName;
    if (
      !resolvedFileName ||
      moduleName.startsWith('.') ||
      this.ngccProcessingCache.hasProcessed(moduleName) ||
      this._entryPointsUrl.includes(ngUrl(moduleName))
    ) {
      // Skip when module is unknown, relative, an entrypoint or already processed.
      return;
    }

    const packageJsonPath = this.tryResolvePackage(moduleName, resolvedFileName);
    if (!packageJsonPath) {
      // add it to processed so the second time round we skip this.
      this.ngccProcessingCache.markProcessed(moduleName);

      return;
    }

    // If the package.json is read only we should skip calling NGCC.
    // With Bazel when running under sandbox the filesystem is read-only.
    try {
      accessSync(packageJsonPath, constants.W_OK);
    } catch {
      // add it to processed so the second time round we skip this.
      this.ngccProcessingCache.markProcessed(moduleName);

      return;
    }

    mainNgcc({
      basePath: this._nodeModulesDirectory,
      targetEntryPointPath: path.dirname(packageJsonPath),
      compileAllFormats: false,
      propertiesToConsider: ['es2015', 'browser', 'module', 'main'],
      createNewEntryPointFormats: true,
      logger: this._logger,
      tsConfigPath: this.projectPath,
    });

    this.ngccProcessingCache.markProcessed(moduleName);
  }

  /**
   * Try resolve a package.json file from the resolved .d.ts file.
   */
  private tryResolvePackage(moduleName: string, resolvedFileName: string): string | undefined {
    try {
      return require.resolve(`${moduleName}/package.json`, {
        paths: [resolvedFileName],
      });
    } catch {
      // if it fails this might be a deep import which doesn't have a package.json
      // Ex: @angular/compiler/src/i18n/i18n_ast/package.json
      // or local libraries which don't reside in node_modules
      const packageJsonPath = path.resolve(resolvedFileName, '../package.json');

      return existsSync(packageJsonPath) ? packageJsonPath : undefined;
    }
  }

  private findNodeModulesDirectory(startPoint: string): string {
    let current = startPoint;
    while (path.dirname(current) !== current) {
      const nodePath = path.join(current, 'node_modules');
      if (existsSync(nodePath)) {
        return nodePath;
      }

      current = path.dirname(current);
    }

    throw new Error(`Cannot locate the 'node_modules' directory.`);
  }
}

class NgccLogger implements Logger {
  level = LogLevel.info;

  debug(...args: string[]) {
    log.debug(args.join(' '));
  }

  info(...args: string[]) {
    log.info(args.join(' '));
  }

  warn(...args: string[]) {
    log.warn(args.join(' '));
  }

  error(...args: string[]) {
    log.error(args.join(' '));
  }
}
