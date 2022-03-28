import ora from 'ora';
import * as path from 'path';
import { AssetPattern } from '../../../ng-package.schema';
import { BuildGraph } from '../../graph/build-graph';
import { Node } from '../../graph/node';
import { transformFromPromise } from '../../graph/transform';
import { colors } from '../../utils/color';
import { copyFile, rmdir, stat, writeFile } from '../../utils/fs';
import { globFiles } from '../../utils/glob';
import * as log from '../../utils/log';
import { ensureUnixPath } from '../../utils/path';
import { EntryPointNode, PackageNode, fileUrl, isEntryPoint, isEntryPointInProgress, isPackage } from '../nodes';
import { NgPackagrOptions } from '../options.di';
import { NgPackage } from '../package';
import { NgEntryPoint } from './entry-point';

type CompilationMode = 'partial' | 'full' | undefined;

export const writePackageTransform = (options: NgPackagrOptions) =>
  transformFromPromise(async graph => {
    const spinner = ora({
      hideCursor: false,
      discardStdin: false,
    });
    const entryPoint: EntryPointNode = graph.find(isEntryPointInProgress());
    const ngEntryPoint: NgEntryPoint = entryPoint.data.entryPoint;
    const ngPackageNode: PackageNode = graph.find(isPackage);
    const ngPackage = ngPackageNode.data;
    const { destinationFiles } = entryPoint.data;

    if (!ngEntryPoint.isSecondaryEntryPoint) {
      spinner.start('Copying assets');
      try {
        await copyAssets(graph, entryPoint, ngPackageNode);
      } catch (error) {
        spinner.fail();
        throw error;
      }
      spinner.succeed();
    }

    // 6. WRITE PACKAGE.JSON
    try {
      spinner.start('Writing package manifest');
      const relativeUnixFromDestPath = (filePath: string) =>
        ensureUnixPath(path.relative(ngEntryPoint.destinationPath, filePath));

      const { compilationMode } = entryPoint.data.tsConfig.options;

      await writePackageJson(
        ngEntryPoint,
        ngPackage,
        {
          module: relativeUnixFromDestPath(destinationFiles.fesm2015),
          es2020: relativeUnixFromDestPath(destinationFiles.fesm2020),
          esm2020: relativeUnixFromDestPath(destinationFiles.esm2020),
          fesm2020: relativeUnixFromDestPath(destinationFiles.fesm2020),
          fesm2015: relativeUnixFromDestPath(destinationFiles.fesm2015),
          typings: relativeUnixFromDestPath(destinationFiles.declarations),
          exports: ngEntryPoint.isSecondaryEntryPoint ? undefined : generatePackageExports(ngEntryPoint, graph),
          // webpack v4+ specific flag to enable advanced optimizations and code splitting
          sideEffects: ngEntryPoint.packageJson.sideEffects ?? false,
        },
        !!options.watch,
        compilationMode as CompilationMode,
        spinner,
      );
    } catch (error) {
      spinner.fail();
      throw error;
    }
    spinner.succeed();
    spinner.succeed(`Built ${ngEntryPoint.moduleId}`);

    return graph;
  });

type AssetEntry = Exclude<AssetPattern, string>;

async function copyAssets(
  graph: BuildGraph,
  entryPointNode: EntryPointNode,
  ngPackageNode: PackageNode,
): Promise<void> {
  const ngPackage = ngPackageNode.data;

  const globsForceIgnored: string[] = ['.gitkeep', '**/.DS_Store', '**/Thumbs.db', `${ngPackage.dest}/**`];
  const defaultAssets: AssetEntry[] = [
    { glob: 'LICENSE', input: '/', output: '/' },
    { glob: '**/README.md', input: '/', output: '/' },
  ];
  const assets: AssetEntry[] = [];

  for (const assetPath of [...ngPackage.assets, ...defaultAssets]) {
    let asset: AssetEntry;
    if (typeof assetPath === 'object') {
      asset = assetPath;
    } else {
      const [isDir, isFile] = await stat(path.join(ngPackage.src, assetPath))
        .then(stats => [stats.isDirectory(), stats.isFile()])
        .catch(() => [false, false]);
      if (isDir) {
        asset = { glob: '**/*', input: assetPath, output: assetPath };
      } else if (isFile) {
        // filenames are their own glob
        asset = {
          glob: path.basename(assetPath),
          input: path.dirname(assetPath),
          output: path.dirname(assetPath),
        };
      } else {
        asset = { glob: assetPath, input: '/', output: '/' };
      }
    }

    asset.input = path.join(ngPackage.src, asset.input);
    asset.output = path.join(ngPackage.dest, asset.output);

    const isAncestorPath = (target: string, datum: string) => path.relative(datum, target).startsWith('..');
    if (isAncestorPath(asset.input, ngPackage.src)) {
      throw new Error('Cannot read assets from a location outside of the project root.');
    }
    if (isAncestorPath(asset.output, ngPackage.dest)) {
      throw new Error('Cannot write assets to a location outside of the output path.');
    }

    assets.push(asset);
  }

  for (const asset of assets) {
    const filePaths = await globFiles(asset.glob, {
      cwd: asset.input,
      ignore: [...(asset.ignore ?? []), ...globsForceIgnored],
      cache: ngPackageNode.cache.globCache,
      dot: true,
      nodir: true,
      follow: asset.followSymlinks,
    });
    for (const filePath of filePaths) {
      const fileSrcFullPath = path.join(asset.input, filePath);
      const fileDestFullPath = path.join(asset.output, filePath);
      const nodeUri = fileUrl(ensureUnixPath(fileSrcFullPath));
      let node = graph.get(nodeUri);
      if (!node) {
        node = new Node(nodeUri);
        graph.put(node);
      }
      entryPointNode.dependsOn(node);
      await copyFile(fileSrcFullPath, fileDestFullPath);
    }
  }
}

/**
 * Creates and writes a `package.json` file of the entry point used by the `node_module`
 * resolution strategies.
 *
 * #### Example
 *
 * A consumer of the entry point depends on it by `import {..} from '@my/module/id';`.
 * The module id `@my/module/id` will be resolved to the `package.json` file that is written by
 * this build step.
 * The properties `main`, `module`, `typings` (and so on) in the `package.json` point to the
 * flattened JavaScript bundles, type definitions, (...).
 *
 * @param entryPoint An entry point of an Angular package / library
 * @param additionalProperties Additional properties, e.g. binary artefacts (bundle files), to merge into `package.json`
 */
async function writePackageJson(
  entryPoint: NgEntryPoint,
  pkg: NgPackage,
  additionalProperties: { [key: string]: string | boolean | string[] | ConditionalExport },
  isWatchMode: boolean,
  compilationMode: CompilationMode,
  spinner: ora.Ora,
): Promise<void> {
  log.debug('Writing package.json');

  // set additional properties
  const packageJson = { ...entryPoint.packageJson, ...additionalProperties };

  // read tslib version from `@angular/compiler` so that our tslib
  // version at least matches that of angular if we use require('tslib').version
  // it will get what installed and not the minimum version nor if it is a `~` or `^`
  // this is only required for primary
  if (!entryPoint.isSecondaryEntryPoint) {
    if (isWatchMode) {
      // Needed because of Webpack's 5 `cachemanagedpaths`
      // https://github.com/angular/angular-cli/issues/20962
      packageJson.version = `0.0.0-watch+${Date.now()}`;
    }

    if (!packageJson.peerDependencies?.tslib && !packageJson.dependencies?.tslib) {
      const {
        peerDependencies: angularPeerDependencies = {},
        dependencies: angularDependencies = {},
      } = require('@angular/compiler/package.json');
      const tsLibVersion = angularPeerDependencies.tslib || angularDependencies.tslib;

      if (tsLibVersion) {
        packageJson.dependencies = {
          ...packageJson.dependencies,
          tslib: tsLibVersion,
        };
      }
    } else if (packageJson.peerDependencies?.tslib) {
      spinner.warn(
        colors.yellow(
          `'tslib' is no longer recommended to be used as a 'peerDependencies'. Moving it to 'dependencies'.`,
        ),
      );
      packageJson.dependencies = {
        ...(packageJson.dependencies || {}),
        tslib: packageJson.peerDependencies.tslib,
      };

      delete packageJson.peerDependencies.tslib;
    }
  }

  // Verify non-peerDependencies as they can easily lead to duplicate installs or version conflicts
  // in the node_modules folder of an application
  const allowedList = pkg.allowedNonPeerDependencies.map(value => new RegExp(value));
  try {
    checkNonPeerDependencies(packageJson, 'dependencies', allowedList, spinner);
  } catch (e) {
    await rmdir(entryPoint.destinationPath, { recursive: true });
    throw e;
  }

  // Removes scripts from package.json after build
  if (packageJson.scripts) {
    if (pkg.keepLifecycleScripts !== true) {
      spinner.info(`Removing scripts section in package.json as it's considered a potential security vulnerability.`);
      delete packageJson.scripts;
    } else {
      spinner.warn(
        colors.yellow(
          `You enabled keepLifecycleScripts explicitly. The scripts section in package.json will be published to npm.`,
        ),
      );
    }
  }

  if (!entryPoint.isSecondaryEntryPoint && compilationMode !== 'partial') {
    const scripts = packageJson.scripts || (packageJson.scripts = {});
    scripts.prepublishOnly =
      'node --eval "console.error(\'' +
      'ERROR: Trying to publish a package that has been compiled by Ivy in full compilation mode. This is not allowed.\\n' +
      'Please delete and rebuild the package with Ivy partial compilation mode, before attempting to publish.\\n' +
      '\')" ' +
      '&& exit 1';
  }

  // keep the dist package.json clean
  // this will not throw if ngPackage field does not exist
  delete packageJson.ngPackage;

  const packageJsonPropertiesToDelete = [
    'stylelint',
    'prettier',
    'browserslist',
    'devDependencies',
    'jest',
    'workspaces',
    'husky',
  ];

  for (const prop of packageJsonPropertiesToDelete) {
    if (prop in packageJson) {
      delete packageJson[prop];
      spinner.info(`Removing ${prop} section in package.json.`);
    }
  }

  packageJson.name = entryPoint.moduleId;
  await writeFile(path.join(entryPoint.destinationPath, 'package.json'), JSON.stringify(packageJson, undefined, 2));
}

function checkNonPeerDependencies(
  packageJson: Record<string, unknown>,
  property: string,
  allowed: RegExp[],
  spinner: ora.Ora,
) {
  if (!packageJson[property]) {
    return;
  }

  for (const dep of Object.keys(packageJson[property])) {
    if (allowed.some(regex => regex.test(dep))) {
      log.debug(`Dependency ${dep} is allowed in '${property}'`);
    } else {
      spinner.warn(
        colors.yellow(
          `Distributing npm packages with '${property}' is not recommended. Please consider adding ${dep} ` +
            `to 'peerDependencies' or remove it from '${property}'.`,
        ),
      );
      throw new Error(`Dependency ${dep} must be explicitly allowed using the "allowedNonPeerDependencies" option.`);
    }
  }
}

type PackageExports = Record<string, ConditionalExport>;

/**
 * Type describing the conditional exports descriptor for an entry-point.
 * https://nodejs.org/api/packages.html#packages_conditional_exports
 */
type ConditionalExport = {
  node?: string;
  types?: string;
  esm2020?: string;
  es2020?: string;
  es2015?: string;
  default?: string;
};

/**
 * Generates the `package.json` package exports following APF v13.
 * This is supposed to match with: https://github.com/angular/angular/blob/e0667efa6eada64d1fb8b143840689090fc82e52/packages/bazel/src/ng_package/packager.ts#L415.
 */
function generatePackageExports({ destinationPath, packageJson }: NgEntryPoint, graph: BuildGraph): PackageExports {
  const exports: PackageExports = packageJson.exports ? JSON.parse(JSON.stringify(packageJson.exports)) : {};

  const insertMappingOrError = (subpath: string, mapping: ConditionalExport) => {
    if (exports[subpath] === undefined) {
      exports[subpath] = {};
    }

    const subpathExport = exports[subpath];

    // Go through all conditions that should be inserted. If the condition is already
    // manually set of the subpath export, we throw an error. In general, we allow for
    // additional conditions to be set. These will always precede the generated ones.
    for (const conditionName of Object.keys(mapping) as [keyof ConditionalExport]) {
      if (subpathExport[conditionName] !== undefined) {
        throw Error(
          `Found a conflicting export condition for "${subpath}". The "${conditionName}" ` +
            `condition would be overridden by ng-packagr. Please unset it.`,
        );
      }

      // **Note**: The order of the conditions is preserved even though we are setting
      // the conditions once at a time (the latest assignment will be at the end).
      subpathExport[conditionName] = mapping[conditionName];
    }
  };

  const relativeUnixFromDestPath = (filePath: string) =>
    './' + ensureUnixPath(path.relative(destinationPath, filePath));

  insertMappingOrError('./package.json', { default: './package.json' });

  const entryPoints = graph.filter(isEntryPoint);
  for (const entryPoint of entryPoints) {
    const { destinationFiles, isSecondaryEntryPoint } = entryPoint.data.entryPoint;
    const subpath = isSecondaryEntryPoint ? `./${destinationFiles.directory}` : '.';

    insertMappingOrError(subpath, {
      types: relativeUnixFromDestPath(destinationFiles.declarations),
      esm2020: relativeUnixFromDestPath(destinationFiles.esm2020),
      es2020: relativeUnixFromDestPath(destinationFiles.fesm2020),
      es2015: relativeUnixFromDestPath(destinationFiles.fesm2015),
      node: relativeUnixFromDestPath(destinationFiles.fesm2015),
      default: relativeUnixFromDestPath(destinationFiles.fesm2020),
    });
  }

  return exports;
}
