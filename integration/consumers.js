/**
 * @file Build the projects in the integration/consumers directory.
 */
'use strict';

const { execSync } = require('child_process');
const { existsSync, statSync, readdirSync } = require('fs');
const { normalize, join, relative, resolve } = require('path');

/** @type {string[]|undefined} */
const projectNameArgs = process.argv.length > 2 ? [...process.argv.splice(2)] : undefined;

/** @type {string} The absolute path to the project root directory. */
const baseDir = resolve(__dirname, '..');

/** @type {string} Relative path to the directory containing the projects. */
const consumersRelPath = normalize('integration/consumers');

/** @type {string} The absolute path to the directory containing integration samples. */
const consumersDir = join(baseDir, consumersRelPath);
if (!existsSync(consumersDir)) {
  console.error(`Could not find ${consumersRelPath} in: ${baseDir}`);
  process.exit(1);
}

/**
 * Returns a list containing the names of all available sample projects.
 *
 * @param {string} consumersDir
 * @returns {string[]}
 */
function getProjectNames(consumersDir) {
  return /** @type {string[]} */ readdirSync(consumersDir).filter(entry => {
    return statSync(join(consumersDir, entry)).isDirectory();
  });
}

/**
 * @param {string[]|undefined} projectList An optional list of sample projects to test, if not present all sample projects will be tested
 * @returns {Promise<void>}
 */
async function buildProjects(projectList) {
  /** @type {string[]} list of projects to build */
  const projectNames = projectList || getProjectNames(consumersDir);
  console.info(`Processing ${consumersRelPath} projects: ${projectNames.join(', ')}\n\n`);
  for (const projectName of projectNames) {
    const projectDir = join(consumersDir, projectName);
    /** @type {import('child_process').ExecSyncOptions} */
    const execOptions = {
      cwd: projectDir,
      stdio: 'inherit',
    };
    console.info(`Installing dependencies for integration consumer: ${projectName}\n`);
    // NOTE: --check-files is required to update linked packages.
    execSync(`yarn install --check-files`, execOptions);
    console.info(`Building integration consumer: ${projectName}\n`);
    execSync(`yarn build`, execOptions);
    console.log(`Finished processing integration consumer: ${projectName}\n\n`);
  }
}

Promise.resolve()
  .then(async () => {
    return buildProjects(projectNameArgs);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
