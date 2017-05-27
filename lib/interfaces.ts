/** CLI arguments passed to `ng-packagr` and `ngPackage()`. */
export interface NgPackagrCliArguments {
  /** Path to the 'ng-package.json' file */
  project: string
}

/** Config object from 'ng-package.json' */
export interface NgPackageConfig {
  src: string,
  dest: string,
  workingDirectory: string,
  ngc: {
    tsconfig: string
  },
  rollup: {
    config: string
  }
}
