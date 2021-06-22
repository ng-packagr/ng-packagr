import { expect } from 'chai';
import { TestHarness } from './test-harness';

describe('basic', () => {
  const harness = new TestHarness('basic');

  before(async () => {
    await harness.initialize();
  });

  afterEach(() => {
    harness.reset();
  });

  after(() => {
    harness.dispose();
  });

  describe('primary entrypoint', () => {
    it("should set a `0.0.0-watch+...` as version number", () => {
      harness.expectPackageManifestToMatch(/"version": "0\.0\.0-watch\+\d+"/);
    });

    it("should perform initial compilation when 'watch' is started", () => {
      harness.expectDtsToMatch('public_api', /title = "hello world"/);
      harness.expectFesm2015ToMatch('basic', /hello world/);
    });

    describe('when file changes', () => {
      it('should perform a partial compilation and emit the updated files', (done) => {
        harness.copyTestCase('valid-text');

        harness.onComplete(() => {
          harness.expectDtsToMatch('public_api', /title = "foo bar"/);
          harness.expectFesm2015ToMatch('basic', /foo bar/);
          done();
        });
      });

      it('should recover from errors', (done) => {
        harness.copyTestCase('invalid-type');

        harness.onComplete(() => {
          harness.expectDtsToMatch('public_api', /title = "foo bar"/);
          harness.expectFesm2015ToMatch('basic', /foo bar/);
          done();
        });

        harness.onFailure((error) => {
          harness.copyTestCase('valid-text');
          expect(error.message).to.match(/is not assignable to type 'boolean'/);
        });
      });

      it('should emit complete when a file changes outside of the compilation', (done) => {
        harness.copyTestCase('new-file');

        harness.onComplete(() => {
          done();
        });
      });
    });
  });

  describe('secondary entrypoint', () => {
    describe('when file changes', () => {
      it('should emit updated files', (done) => {
        harness.copyTestCase('secondary-valid');

        harness.onComplete(() => {
          harness.expectFesm2015ToMatch('basic-secondary', /Hello Angular/);
          done();
        });
      });
    });
  });
});
