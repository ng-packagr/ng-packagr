/** CLI arguments passed to `ng-packagr` and `ngPackage()`. */
export interface NgPackagrCliArguments {
  /** Path to the '.ng-packagr.json' file */
  project: string
}

/** Config object from '.ng-packagr.json' */
export interface NgPackagrConfig {
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
