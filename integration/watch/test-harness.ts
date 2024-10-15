import * as fs from 'fs-extra';
import * as path from 'path';
import * as log from '../../dist/lib/utils/log';
import { expect } from 'chai';
import { Subscription, tap } from 'rxjs';
import { ngPackagr } from '../../dist';

/**
 * A testing harness class to setup the enviroment andtest the incremental builds.
 */
export class TestHarness {
  private harnessTempDir = path.join(__dirname, '.tmp');
  private testTempPath = path.join(this.harnessTempDir, this.testName);
  private testSrc = path.join(__dirname, this.testName);
  private testDistPath = path.join(this.testTempPath, 'dist');
  private ngPackagr$$: Subscription;
  private loggerStubs: Record<string, jasmine.Spy> = {};

  constructor(private testName: string) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  }

  async initialize(): Promise<void> {
    // the below is done in order to avoid poluting the test reporter with build logs
    for (const key in log) {
      if (log.hasOwnProperty(key)) {
        this.loggerStubs[key] = spyOn(log, key as keyof typeof log).and.callFake(() => null);
      }
    }

    this.emptyTestDirectory();
    await fs.copy(this.testSrc, this.testTempPath);
    return this.setUpNgPackagr();
  }

  dispose(): void {
    this.loggerStubs = {};

    if (this.ngPackagr$$) {
      this.ngPackagr$$.unsubscribe();
    }

    this.emptyTestDirectory();
  }

  readFileSync(filePath: string, isJson = false): string | object {
    const file = path.join(this.testDistPath, filePath);
    return isJson ? fs.readJsonSync(file) : fs.readFileSync(file, { encoding: 'utf-8' });
  }

  /**
   * Copy a test case to it's temporary destination immediately.
   */
  copyTestCase(caseName: string) {
    fs.copySync(path.join(this.testSrc, 'test_files', caseName), this.testTempPath);
  }

  expectFesm2022ToMatch(fileName: string, regexp: RegExp): Chai.Assertion {
    return expect(this.readFileSync(`fesm2022/${fileName}.mjs`)).to.match(regexp);
  }

  expectFileToMatch(fileName: string, regexp: RegExp): Chai.Assertion {
    return expect(this.readFileSync(fileName)).to.match(regexp);
  }

  expectDtsToMatch(fileName: string, regexp: RegExp): Chai.Assertion {
    return expect(this.readFileSync(`${fileName}.d.ts`)).to.match(regexp);
  }

  expectPackageManifestToMatch(regexp: RegExp): Chai.Assertion {
    return expect(this.readFileSync('package.json')).to.match(regexp);
  }

  /**
   * Gets invoked when a compilation completes succesfully.
   */
  onComplete(done: () => void): void {
    this.loggerStubs['success'].and.callFake(msg => {
      if (msg.includes('Built Angular Package')) {
        done();
      }
    });
  }

  /**
   * Gets invoked when a compilation error occuries.
   */
  onFailure(done: (error: Error) => void): void {
    this.loggerStubs['error'].and.callFake(done);
  }

  /**
   * Remove the entire directory for the current test case.
   */
  emptyTestDirectory(): void {
    fs.emptyDirSync(this.testTempPath);
  }

  getFilePath(filePath: string): string {
    return path.join(this.testDistPath, filePath);
  }

  private setUpNgPackagr(): Promise<void> {
    return new Promise(resolve => {
      this.ngPackagr$$ = ngPackagr()
        .forProject(path.join(this.testTempPath, 'ng-package.json'))
        .withTsConfig(path.join(this.testTempPath, 'tsconfig.ngc.json'))
        .watch()
        .pipe(
          tap(() => resolve()), // we are only interested when in the first builds, that's why we are resolving it
        )
        .subscribe();
    });
  }
}
