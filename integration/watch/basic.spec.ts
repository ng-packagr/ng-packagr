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
    it("should perform initial compilation when 'watch' is started", () => {
      harness.expectDtsToMatch('public_api', /title = "hello world"/);
      harness.expectFesm5ToContain('basic', 'title', 'hello world');
      harness.expectFesm2015ToContain('basic', 'title', 'hello world');
      harness.expectMetadataToContain('basic', 'metadata.title', 'hello world');
    });

    describe('when file changes', () => {
      it('should perform a partial compilation and emit the updated files', done => {
        harness.copyTestCase('valid-text');

        harness.onComplete(() => {
          harness.expectDtsToMatch('public_api', /title = "foo bar"/);
          harness.expectFesm5ToContain('basic', 'title', 'foo bar');
          harness.expectFesm2015ToContain('basic', 'title', 'foo bar');
          harness.expectMetadataToContain('basic', 'metadata.title', 'foo bar');
          done();
        });
      });

      it('should recover from errors', done => {
        harness.copyTestCase('invalid-type');

        harness.onComplete(() => {
          harness.expectDtsToMatch('public_api', /title = "foo bar"/);
          harness.expectFesm5ToContain('basic', 'title', 'foo bar');
          harness.expectFesm2015ToContain('basic', 'title', 'foo bar');
          harness.expectMetadataToContain('basic', 'metadata.title', 'foo bar');
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
          harness.expectFesm5ToContain('basic-secondary', 'ɵa.decorators[0].args[0].template', 'Hello Angular');
          harness.expectFesm2015ToContain('basic-secondary', 'ɵa.decorators[0].args[0].template', 'Hello Angular');
          harness.expectMetadataToContain(
            'secondary/basic-secondary',
            'metadata.ɵa.decorators[0].arguments[0].template',
            'Hello Angular'
          );
          done();
        });
      });
    });
  });
});
