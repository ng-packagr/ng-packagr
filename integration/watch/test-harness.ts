import * as fs from 'fs-extra';
import * as sinon from 'sinon';
import * as path from 'path';
import * as log from '../../src/lib/util/log';
import { expect } from 'chai';
import { Subscription } from 'rxjs';
import { ngPackagr } from '../../src/public_api';
import { tap } from 'rxjs/operators';

/**
 * A testing harness class to setup the enviroment andtest the incremental builds.
 */
export class TestHarness {
  private completeHandler = () => undefined;

  private tmpPath = path.join(__dirname, '.tmp', this.testName);
  private testSrc = path.join(__dirname, this.testName);
  private ngPackagr$$: Subscription;

  constructor(private testName: string) {}

  initialize(): Promise<void> {
    // the below is done in order to avoid poluting the test reporter with build logs
    sinon.stub(log, 'msg');
    sinon.stub(log, 'info');
    sinon.stub(log, 'debug');
    sinon.stub(log, 'success');
    sinon.stub(log, 'warn');

    this.emptyTestDirectory();
    fs.copySync(this.testSrc, this.tmpPath);
    return this.setUpNgPackagr();
  }

  dispose(): void {
    this.reset();

    if (this.ngPackagr$$) {
      this.ngPackagr$$.unsubscribe();
    }

    this.emptyTestDirectory();
  }

  reset(): void {
    this.completeHandler = () => undefined;
  }

  readFileSync(filePath: string, isJson = false): string | object {
    const file = path.join(this.tmpPath, 'dist', filePath);
    return isJson ? fs.readJsonSync(file) : fs.readFileSync(file, { encoding: 'utf-8' });
  }

  /**
   * Copy a test case to it's temporary destination immediately.
   */
  copyTestCase(caseName: string) {
    fs.copySync(path.join(this.testSrc, 'test_files', caseName), this.tmpPath);
  }

  expectFesm5ToContain(fileName: string, path: string, value: any): Chai.Assertion {
    return expect(this.requireNoCache(`fesm5/${fileName}.js`)).to.have.nested.property(path, value);
  }

  expectFesm2015ToContain(fileName: string, path: string, value: any): Chai.Assertion {
    return expect(this.requireNoCache(`fesm2015/${fileName}.js`)).to.have.nested.property(path, value);
  }

  expectDtsToMatch(fileName: string, regexp: RegExp): Chai.Assertion {
    return expect(this.readFileSync(`${fileName}.d.ts`)).to.match(regexp);
  }

  expectMetadataToContain(fileName: string, path: string, value: any): Chai.Assertion {
    const data = this.readFileSync(`${fileName}.metadata.json`, true);
    return expect(data).to.have.nested.property(path, value);
  }

  /**
   * Gets invoked when a compilation completes succesfully.
   */
  onComplete(done: () => void): void {
    this.completeHandler = done;
  }

  /**
   * Gets invoked when a compilation error occuries.
   */
  onFailure(done: (error: Error) => void): void {
    sinon.stub(log, 'error').callsFake(done);
  }

  /**
   * Remove the entire directory for the current test case.
   */
  emptyTestDirectory(): void {
    fs.emptyDirSync(this.tmpPath);
  }

  private setUpNgPackagr(): Promise<void> {
    return new Promise(resolve => {
      this.ngPackagr$$ = ngPackagr()
        .forProject(path.join(this.tmpPath, 'package.json'))
        .watch()
        .pipe(
          tap(() => resolve()), // we are only interested when in the first builds, that's why we are resolving it
          tap(() => this.completeHandler())
        )
        .subscribe();
    });
  }

  private requireNoCache(modulePath: string): any {
    const moduleFile = this.buildFilePath(modulePath);
    delete require.cache[path.resolve(moduleFile)];
    return require(moduleFile);
  }

  private buildFilePath(filePath: string): string {
    return path.join(this.tmpPath, 'dist', filePath);
  }
}
