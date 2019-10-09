import { Logger, PathMappings, process as mainNgcc } from '@angular/compiler-cli/ngcc';
import { existsSync } from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import * as log from '../util/log';
import { EntryPointNode, ngUrl } from '../ng-v5/nodes';

// Transform a package and its typings when NGTSC is resolving a module.
export class NgccProcessor {
  private _processedModules = new Set<string>();
  private _logger: NgccLogger;
  private _nodeModulesDirectory: string;
  private _pathMappings: PathMappings | undefined;
  private _entryPointsUrl: string[];

  constructor(private readonly compilerOptions: ts.CompilerOptions, private readonly entryPoints: EntryPointNode[]) {
    this._entryPointsUrl = this.entryPoints.map(({ url }) => ngUrl(url));

    const { baseUrl, paths } = this.compilerOptions;
    this._nodeModulesDirectory = this.findNodeModulesDirectory(baseUrl);

    if (baseUrl && paths) {
      this._pathMappings = {
        baseUrl,
        paths,
      };
    }
  }

  processModule(moduleName: string, resolvedModule: ts.ResolvedModule | ts.ResolvedTypeReferenceDirective): void {
    const resolvedFileName = resolvedModule.resolvedFileName;
    if (
      !resolvedFileName ||
      moduleName.startsWith('.') ||
      this._processedModules.has(moduleName) ||
      this._entryPointsUrl.includes(ngUrl(moduleName))
    ) {
      // Skip when module is unknown, relative, an entrypoint or already processed.
      return;
    }

    const packageJsonPath = this.tryResolvePackage(moduleName, resolvedFileName);
    if (!packageJsonPath) {
      // add it to processed so the second time round we skip this.
      this._processedModules.add(moduleName);

      return;
    }

    mainNgcc({
      basePath: this._nodeModulesDirectory,
      targetEntryPointPath: path.dirname(packageJsonPath),
      compileAllFormats: false,
      propertiesToConsider: ['es2015', 'browser', 'module', 'main'],
      createNewEntryPointFormats: true,
      logger: this._logger,
      pathMappings: this._pathMappings,
    });

    this._processedModules.add(moduleName);
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
