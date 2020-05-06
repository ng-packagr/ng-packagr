import { TestHarness } from './test-harness';

describe('resources', () => {
  const harness = new TestHarness('resources');

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
      harness.expectFesm2015ToMatch('resources', /Angular!/);
      harness.expectFesm2015ToMatch('resources', /a{color:#000}/);
    });

    describe('when file changes', () => {
      it('should perform a partial compilation and emit the updated template', (done) => {
        harness.copyTestCase('html-template');

        harness.onComplete(() => {
          harness.expectFesm2015ToMatch('resources', /Hello World!/);
          done();
        });
      });

      it('should perform a partial compilation and emit the updated styles', (done) => {
        harness.copyTestCase('scss-file');

        harness.onComplete(() => {
          harness.expectFesm2015ToMatch('resources', /a{color:#fff}/);
          done();
        });
      });
    });
  });
});
