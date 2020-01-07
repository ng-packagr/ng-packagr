/** A list of output absolute paths for various formats */
export interface DestinationFiles {
  /** Absolute path of this entry point `declarations` */
  declarations: string;
  /** Absolute path of this entry point `metadata` */
  metadata: string;
  /** Absolute path of this entry point `FESM5` module */
  fesm5: string;
  /** Absolute path of this entry point `FESM5` module */
  fesm2015: string;
  /** Absolute path of this entry point `ESM5` module */
  esm5: string;
  /** Absolute path of this entry point `ESM2015` module */
  esm2015: string;
  /** Absolute path of this entry point `UMD` bundle */
  umd: string;
  /** Absolute path of this entry point `UMD` Minifief bundle */
  umdMinified: string;
}
