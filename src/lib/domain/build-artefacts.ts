import * as path from 'path';
import * as ts from 'typescript';
import { TsConfig } from '../steps/ngc';
import { NgEntryPoint, NgPackage, CssUrl } from './ng-package-format';

/**
 * Build artefacts generated for an entry point (Angular library).
 *
 * The artefacts include distribution-ready 'binaries' as well as temporary files and
 * intermediate build output.
 */
export class Artefacts {

  /** Directory for temporary files */
  public stageDir: string;

  /** Directory for build output */
  public outDir: string;

  private _extras: Map<string, any> = new Map();

  constructor(
    entryPoint: NgEntryPoint,
    pkg: NgPackage
  ) {
    this.stageDir = path.resolve(pkg.workingDirectory, entryPoint.flatModuleFile, 'stage');
    this.outDir = path.resolve(pkg.workingDirectory, entryPoint.flatModuleFile, 'out');
  }

  public extras<T> (key: string): T;
  public extras<T> (key: string, value: T);
  public extras<T> (key: string, value?: T): T | undefined {
    if (value !== undefined) {
      // write
      this._extras.set(key, value);
    } else {
      // read
      return this._extras.get(key);
    }
  }

  public get tsConfig(): TsConfig {
    return this.extras('tsConfig');
  }

  public set tsConfig(value: TsConfig) {
    this.extras('tsConfig', value);
  }

  public get tsSources(): ts.TransformationResult<ts.SourceFile> {
    return this.extras('tsSources');
  }

  public set tsSources(value: ts.TransformationResult<ts.SourceFile>) {
    this.extras('tsSources', value);
  }

  public template(file: string): string;
  public template(file: string, content: string);
  public template(file: string, content?: string): string | undefined {
    if (content !== undefined) {
      // write
      this.extras(`template:${file}`, content);
    } else {
      // read
      return this.extras(`template:${file}`);
    }
  }

  public templates(): string[] {
    return Array.from(this._extras.keys())
      .filter((key) => key.startsWith('template:'))
      .map((key) => key.substring('template:'.length));
  }

  public stylesheet(file: string): string;
  public stylesheet(file: string, content: string);
  public stylesheet(file: string, content?: string): string | undefined {
    if (content !== undefined) {
      // write
      this.extras(`stylesheet:${file}`, content);
    } else {
      // read
      return this.extras(`stylesheet:${file}`);
    }
  }

  public stylesheets(): string[] {
    return Array.from(this._extras.keys())
      .filter((key) => key.startsWith('stylesheet:'))
      .map((key) => key.substring('stylesheet:'.length));
  }

}
