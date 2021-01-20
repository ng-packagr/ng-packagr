import { Logger, process as mainNgcc, LogLevel } from '@angular/compiler-cli/ngcc';
import { existsSync, constants, accessSync } from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { NgccProcessingCache } from '../ng-package/ngcc-cache';
import * as log from '../utils/log';
import { EntryPointNode, ngUrl } from '../ng-package/nodes';
import { spawnSync } from 'child_process';
import { createHash } from 'crypto';
import { exists, readFile, writeFile, mkdir } from '../utils/fs';

// Transform a package and its typings when NGTSC is resolving a module.
export class NgccProcessor {
  private _logger: NgccLogger;
  private _nodeModulesDirectory: string;
  private _entryPointsUrl: string[];
  private readonly propertiesToConsider = ['es2015', 'browser', 'module', 'main'];
  private skipProcessing = true;

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

  /** Process the entire node modules tree. */
  async process(): Promise<void> {
    // Under Bazel when running in sandbox mode parts of the filesystem is read-only.
    if (process.env.BAZEL_TARGET) {
      return;
    }

    // Only allow running this during the first run.
    if (this.skipProcessing) {
      return;
    }

    // Skip if node_modules are read-only
    const corePackage = this.tryResolvePackage('@angular/core', this._nodeModulesDirectory);
    if (corePackage && isReadOnlyFile(corePackage)) {
      return;
    }

    // Perform a ngcc run check to determine if an initial execution is required.
    // If a run hash file exists that matches the current package manager lock file and the
    // project's tsconfig, then an initial ngcc run has already been performed.
    let runHashFilePath: string | undefined;
    const runHashBasePath = path.join(this._nodeModulesDirectory, '.ng-packagr-ngcc');
    const projectBasePath = path.join(this._nodeModulesDirectory, '..');
    try {
      let lockData;
      let lockFile = 'yarn.lock';
      try {
        lockData = await readFile(path.join(projectBasePath, lockFile));
      } catch {
        lockFile = 'package-lock.json';
        lockData = await readFile(path.join(projectBasePath, lockFile));
      }

      let ngccConfigData;
      try {
        ngccConfigData = await readFile(path.join(projectBasePath, 'ngcc.config.js'));
      } catch {
        ngccConfigData = '';
      }

      const relativeTsconfigPath = path.relative(projectBasePath, this.projectPath);
      const tsconfigData = await readFile(this.projectPath);

      // Generate a hash that represents the state of the package lock file and used tsconfig
      const runHash = createHash('sha256')
        .update(lockData)
        .update(lockFile)
        .update(ngccConfigData)
        .update(tsconfigData)
        .update(relativeTsconfigPath)
        .digest('hex');

      // The hash is used directly in the file name to mitigate potential read/write race
      // conditions as well as to only require a file existence check
      runHashFilePath = path.join(runHashBasePath, runHash + '.lock');

      // If the run hash lock file exists, then ngcc was already run against this project state
      if (await exists(runHashFilePath)) {
        this.skipProcessing = true;

        return;
      }
    } catch {
      // Any error means an ngcc execution is needed
    }

    const { status, error } = spawnSync(
      process.execPath,
      [
        require.resolve('@angular/compiler-cli/ngcc/main-ngcc.js'),
        '--source' /** basePath */,
        this._nodeModulesDirectory,
        '--properties' /** propertiesToConsider */,
        ...this.propertiesToConsider,
        '--first-only' /** compileAllFormats */,
        '--create-ivy-entry-points' /** createNewEntryPointFormats */,
        '--async',
        '--tsconfig' /** tsConfigPath */,
        this.projectPath,
        '--use-program-dependencies',
      ],
      {
        stdio: ['inherit', process.stderr, process.stderr],
      },
    );

    this.skipProcessing = true;

    if (status !== 0) {
      const errorMessage = error?.message || '';
      throw new Error(errorMessage + `NGCC failed${errorMessage ? ', see above' : ''}.`);
    }

    // ngcc was successful so if a run hash was generated, write it for next time
    if (runHashFilePath) {
      try {
        if (!existsSync(runHashBasePath)) {
          await mkdir(runHashBasePath, { recursive: true });
        }
        await writeFile(runHashFilePath, '');
      } catch {
        // Errors are non-fatal
      }
    }
  }

  /** Process a module and it's depedencies. */
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
    if (isReadOnlyFile(packageJsonPath)) {
      // add it to processed so the second time round we skip this.
      this.ngccProcessingCache.markProcessed(moduleName);

      return;
    }

    mainNgcc({
      basePath: this._nodeModulesDirectory,
      targetEntryPointPath: path.dirname(packageJsonPath),
      compileAllFormats: false,
      propertiesToConsider: this.propertiesToConsider,
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

function isReadOnlyFile(fileName: string): boolean {
  try {
    accessSync(fileName, constants.W_OK);

    return false;
  } catch {
    return true;
  }
}
