import { TestHarness } from './test-harness';

describe('assets', () => {
  const harness = new TestHarness('assets');

  beforeAll(async () => {
    await harness.initialize();
  });

  afterAll(() => {
    harness.dispose();
  });

  describe('assets', () => {
    it("should copy file during initial compilation when 'watch' is started", () => {
      harness.expectFileToMatch('assets/styles/theme.scss', /red/);
    });

    describe('when file changes', () => {
      it('should copy updated file when using advanced assets pattern', done => {
        harness.copyTestCase('advanced-asset');

        harness.onComplete(() => {
          harness.expectFileToMatch('assets/styles/theme.scss', /blue/);
          done();
        });
      });
    });
  });
});
