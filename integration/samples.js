/**
 * @file Build the projects in the integration/samples directory.
 */
'use strict';
const { execSync } = require('child_process');
const { existsSync, statSync, readdirSync } = require('fs');
const { normalize, join, relative, resolve } = require('path');

/** @type {string[]|undefined} */
const projectNameArgs = process.argv.length > 2 ? [...process.argv.splice(2)] : undefined;

/** @type {string} The absolute path to the project root directory. */
const baseDir = resolve(__dirname, '..');

/** @type {string} The absolute path to ng-packagr. */
const ngPackagrPath = join(baseDir, 'dist/cli/main.js');
if (process.env.NG_PACKAGR_REBUILD === 'true' || !existsSync(ngPackagrPath)) {
  console.info('Building ng-packagr...');
  execSync('yarn build', {
    cwd: baseDir,
    stdio: 'inherit',
  });
}

/** @type {string} Relative path to the directory containing the projects. */
const samplesRelPath = normalize('integration/samples');

/** @type {string} The absolute path to the directory containing integration samples. */
const samplesDir = join(baseDir, samplesRelPath);
if (!existsSync(samplesDir)) {
  console.error(`Could not find ${samplesRelPath} in: ${baseDir}`);
  process.exit(1);
}

/**
 * Returns the ng-packagr project file.
 *
 * @param projectDir
 * @param packageFileCandidates
 * @returns {string|undefined}
 */
function getProjectFile(projectDir, packageFileCandidates) {
  for (const packageFileCandidate of packageFileCandidates) {
    const packageFilePath = join(projectDir, packageFileCandidate);
    try {
      if (statSync(packageFilePath).isFile()) {
        return packageFilePath;
      }
    } catch {}
  }
  return undefined;
}

/**
 * Returns a list containing the names of all available sample projects.
 *
 * @param {string} samplesDir
 * @returns {string[]}
 */
function getProjectNames(samplesDir) {
  return /** @type {string[]} */ readdirSync(samplesDir).filter(entry => {
    return statSync(join(samplesDir, entry)).isDirectory();
  });
}

/**
 * Returns a glob for loading all integration sample tests.
 *
 * @param {string[]|undefined} projectNames a list of projects to build.
 * @returns {string}
 */
function getSpecFilesGlob(projectNames) {
  if (projectNames) {
    if (projectNames.length > 1) {
      return `integration/samples/{${projectNames.join(',')}}/specs/**/*.ts`;
    }
    return projectNames.map(name => `integration/samples/${name}/specs/**/*.ts`).join(',');
  }
  return 'integration/samples/*/specs/**/*.ts';
}

/**
 * Builds the project located at the given directory.
 *
 * @param {string} dirName
 * @param {string} projectFilePath
 * @returns {Promise<void>}
 */
async function buildProject(dirName, projectFilePath) {
  // All integration samples starting with "fail" are expected to fail.
  let expectedToFail = false;
  if (dirName.startsWith('fail')) {
    console.info('NOTE: This next package build is expected to fail!');
    expectedToFail = true;
  }
  try {
    /** @type {import('child_process').ExecSyncOptions} */
    const execOptions = {
      cwd: baseDir,
      stdio: 'inherit',
    };
    const command = projectFilePath.endsWith('ng-packagr-api.js')
      ? `node ${projectFilePath}`
      : `node ${ngPackagrPath} -p ${projectFilePath}`;
    execSync(command, execOptions);
    if (expectedToFail) {
      console.error('Integration sample package build was expected to fail!');
      process.exit(1);
    }
  } catch (err) {
    // Ignore build errors for projects that are expected to fail
    if (expectedToFail) {
      return Promise.resolve(undefined);
    }
    // NOTE: The error is already displayed in stderr.
    console.error('Integration sample package build has failed.');
    process.exit(1);
  }
}

/**
 * @param {string[]|undefined} projectList An optional list of sample projects to build, if not present all sample projects will be built
 * @returns {Promise<void>}
 */
async function buildProjects(projectList) {
  /** @type {string[]} List of valid ng-packagr project configuration files. */
  const ngPackagrFileCandidates = ['ng-packagr-api.js', 'ng-package.js', 'ng-package.json', 'package.json'];

  /** @type {string[]} list of projects to build */
  const projectNames = projectList || getProjectNames(samplesDir);
  console.info(`Processing ${samplesRelPath} projects: ${projectNames.join(', ')}\n\n`);
  for (const projectName of projectNames) {
    const projectDir = join(samplesDir, projectName);
    const projectFile = getProjectFile(projectDir, ngPackagrFileCandidates);
    if (!projectFile) {
      console.info(`No package found in directory, skipping: ${projectDir}\n\n`);
      continue;
    }
    console.info(`Processing integration sample: ${relative(baseDir, projectFile)}`);
    // The scripts exits in case of unexpected build errors.
    await buildProject(projectName, projectFile).then(() => {
      console.log(`Finished processing integration sample: ${projectName}\n\n`);
    });
  }
}

/**
 * @param {string[]|undefined} projectList An optional list of sample projects to test, if not present all sample projects will be tested
 * @returns {Promise<void>}
 */
async function testProjects(projectList) {
  /** @type {import('child_process').ExecSyncOptions} */
  const execOptions = {
    cwd: baseDir,
    stdio: 'inherit',
    env: {
      TS_NODE_PROJECT: join(baseDir, 'integration/tsconfig.specs.json'),
      ...process.env,
    },
  };
  const specFilesGlob = getSpecFilesGlob(projectList);
  console.info(`Running tests: ${specFilesGlob}`);
  execSync(`npx mocha --require ts-node/register "${specFilesGlob}"`, execOptions);
}

Promise.resolve()
  .then(async () => {
    if (process.env.NG_PACKAGR_SAMPLES_SKIP_BUILD === 'true') {
      console.info('Skipping integration samples build.');
      return Promise.resolve();
    }
    return buildProjects(projectNameArgs);
  })
  .then(async () => {
    if (process.env.NG_PACKAGR_SAMPLES_SKIP_SPECS === 'true') {
      console.info('Skipping integration samples test.');
      return Promise.resolve();
    }
    return testProjects(projectNameArgs);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
