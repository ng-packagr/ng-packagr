import { rmSync } from 'node:fs';
import { afterAll, beforeAll, describe, it } from 'vitest';
import { TestHarness } from './test-harness';

describe('assets', () => {
  const harness = new TestHarness('assets');

  function waitForBuild(assertion: () => void): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      harness.onComplete(() => {
        try {
          assertion();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

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

    it('recreates removed output directories on the next watch build', async () => {
      rmSync(harness.getFilePath('assets/styles'), { recursive: true, force: true });
      const completed = waitForBuild(() => harness.expectFileToMatch('assets/styles/theme.scss', /red/));

      harness.reSaveSrcFile('src/styles/theme.scss');
      await completed;
    });

    describe('when file changes', () => {
      it('should copy updated file when using advanced assets pattern', async () => {
        const completed = waitForBuild(() => harness.expectFileToMatch('assets/styles/theme.scss', /blue/));

        harness.copyTestCase('advanced-asset');
        await completed;
      });
    });
  });
});
