import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Subscription, tap } from 'rxjs';
import { expect, vi } from 'vitest';
import { ngPackagr } from '../../dist';

/**
 * A testing harness class to setup the enviroment and test the incremental builds.
 */
export class TestHarness {
  private harnessTempDir = join(__dirname, '.tmp');
  private testTempPath: string;
  private testDistPath: string;
  private testSrc: string;
  private ngPackagr$$: Subscription | undefined;
  private activeCompleteCallback: (() => void) | null = null;
  private activeFailureCallback: ((error: Error) => void) | null = null;

  constructor(testName: string) {
    this.testTempPath = join(this.harnessTempDir, testName);
    this.testSrc = join(__dirname, testName);
    this.testDistPath = join(this.testTempPath, 'dist');

    vi.setConfig({ testTimeout: 15000 });
  }

  async initialize(): Promise<void> {
    // the below is done in order to avoid poluting the test reporter with build logs
    vi.spyOn(console, 'log').mockImplementation((...args: any[]) => {
      const msg = args.join(' ');
      if (msg.includes('Built Angular Package') || msg.includes('Compilation sequence updated')) {
        if (this.activeCompleteCallback) {
          const cb = this.activeCompleteCallback;
          this.activeCompleteCallback = null;
          cb();
        }
      }
    });
    vi.spyOn(console, 'error').mockImplementation((...args: any[]) => {
      const msg = args.join(' ');
      if (this.activeFailureCallback) {
        const cb = this.activeFailureCallback;
        this.activeFailureCallback = null;
        cb(new Error(msg));
      }
    });
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    this.emptyTestDirectory();
    cpSync(this.testSrc, this.testTempPath, { recursive: true });

    return this.setUpNgPackagr();
  }

  dispose(): void {
    this.activeCompleteCallback = null;
    this.activeFailureCallback = null;
    this.ngPackagr$$?.unsubscribe();
    this.emptyTestDirectory();
  }

  readFileSync(filePath: string, isJson = false): string | object {
    const file = join(this.testDistPath, filePath);
    return isJson ? JSON.parse(readFileSync(file, 'utf-8')) : readFileSync(file, { encoding: 'utf-8' });
  }

  reSaveSrcFile(filePath: string): void {
    const file = join(this.testTempPath, filePath);
    writeFileSync(file, readFileSync(file));
  }

  /**
   * Copy a test case to it's temporary destination immediately.
   */
  copyTestCase(caseName: string) {
    cpSync(join(this.testSrc, 'test_files', caseName), this.testTempPath, { recursive: true });
  }

  expectFesm2022ToMatch(fileName: string, regexp: RegExp) {
    return expect(this.readFileSync(`fesm2022/${fileName}.mjs`)).to.match(regexp);
  }

  expectFileToMatch(fileName: string, regexp: RegExp) {
    return expect(this.readFileSync(fileName)).to.match(regexp);
  }

  expectDtsToMatch(fileName: string, regexp: RegExp) {
    return expect(this.readFileSync(`types/${fileName}.d.ts`)).to.match(regexp);
  }

  expectPackageManifestToMatch(regexp: RegExp) {
    return expect(this.readFileSync('package.json')).to.match(regexp);
  }

  /**
   * Gets invoked when a compilation completes successfully.
   */
  onComplete(done: () => void): void {
    this.activeCompleteCallback = done;
  }

  /**
   * Gets invoked when a compilation error occurs.
   */
  onFailure(done: (error: Error) => void): void {
    this.activeFailureCallback = done;
  }

  /**
   * Remove the entire directory for the current test case.
   */
  emptyTestDirectory(): void {
    rmSync(this.testTempPath, { recursive: true, force: true });
    mkdirSync(this.testTempPath, { recursive: true });
  }

  getFilePath(filePath: string): string {
    return join(this.testDistPath, filePath);
  }

  private setUpNgPackagr(): Promise<void> {
    return new Promise(resolve => {
      this.ngPackagr$$ = ngPackagr()
        .forProject(join(this.testTempPath, 'ng-package.json'))
        .withTsConfig(join(this.testTempPath, 'tsconfig.ngc.json'))
        .watch()
        .pipe(
          tap(() => resolve()), // we are only interested when in the first builds, that's why we are resolving it
        )
        .subscribe();
    });
  }
}
