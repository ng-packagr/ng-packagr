import { expect } from 'chai';
import { TestHarness } from './test-harness';

describe('basic', () => {
  const harness = new TestHarness('basic');

  beforeAll(async () => {
    await harness.initialize();
  });

  afterAll(() => {
    harness.dispose();
  });

  describe('primary entrypoint', () => {
    it('should set a `0.0.0-watch+...` as version number', () => {
      harness.expectPackageManifestToMatch(/"version": "0\.0\.0-watch\+\d+"/);
    });

    it("should perform initial compilation when 'watch' is started", () => {
      harness.expectDtsToMatch('basic', /title = "hello world"/);
      harness.expectFesm2022ToMatch('basic', /hello world/);
    });

    describe('when file changes', () => {
      it('should perform a partial compilation and emit the updated files', done => {
        harness.copyTestCase('valid-text');

        harness.onComplete(() => {
          harness.expectDtsToMatch('basic', /title = "foo bar"/);
          harness.expectFesm2022ToMatch('basic', /foo bar/);
          done();
        });
      });

      it('should recover from errors', done => {
        harness.copyTestCase('invalid-type');

        harness.onComplete(() => {
          harness.expectDtsToMatch('basic', /title = "foo bar"/);
          harness.expectFesm2022ToMatch('basic', /foo bar/);
          done();
        });

        harness.onFailure(error => {
          harness.copyTestCase('valid-text');
          expect(error.message).to.match(/is not assignable to type 'boolean'/);
        });
      });
    });
  });

  describe('secondary entrypoint', () => {
    describe('when file changes', () => {
      it('should emit updated files', done => {
        harness.copyTestCase('secondary-valid');

        harness.onComplete(() => {
          harness.expectFesm2022ToMatch('basic-secondary', /Hello Angular/);
          done();
        });
      });
    });
  });
});
