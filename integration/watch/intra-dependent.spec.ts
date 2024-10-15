import { expect } from 'chai';
import * as fs from 'fs';
import { TestHarness } from './test-harness';

describe('intra-dependent', () => {
  const harness = new TestHarness('intra-dependent');

  beforeAll(async () => {
    await harness.initialize();
  });

  afterAll(() => {
    harness.dispose();
  });

  it("should perform initial compilation when 'watch' is started", () => {
    harness.expectDtsToMatch('src/primary.component', /count: number/);
  });

  it('should fail when introducing a circular import.', done => {
    harness.copyTestCase('circular');

    harness.onFailure(error => {
      expect(error.message).to.contain('Entry point intra-dependent has a circular dependency on itself.');
      harness.copyTestCase('valid');
      done();
    });
  });

  it('should throw error component inputs is changed without updating usages', done => {
    harness.copyTestCase('invalid-component-property');

    harness.onFailure(error => {
      expect(error.message).to.match(/Can\'t bind to \'count\' since it isn\'t a known property/);
      harness.copyTestCase('valid');
      done();
    });
  });

  it('should throw error service method is changed without updating usages', done => {
    harness.copyTestCase('invalid-service-method');

    harness.onFailure(error => {
      expect(error.message).to.match(/Property \'initialize\' does not exist on type \'PrimaryAngularService\'/);
      harness.copyTestCase('valid');
      done();
    });
  });

  // todo we should find a better way to test this case.
  xit('should only build entrypoints that are dependent on the file changed.', done => {
    const primaryFesmPath = harness.getFilePath('fesm2022/intra-dependent.mjs');
    const secondaryFesmPath = harness.getFilePath('fesm2022/intra-dependent-secondary.mjs');
    const thirdFesmPath = harness.getFilePath('fesm2022/intra-dependent-third.mjs');

    const primaryModifiedTime = fs.statSync(primaryFesmPath).mtimeMs;
    const secondaryModifiedTime = fs.statSync(secondaryFesmPath).mtimeMs;
    const thirdModifiedTime = fs.statSync(thirdFesmPath).mtimeMs;
    harness.copyTestCase('valid');

    harness.onComplete(() => {
      expect(fs.statSync(primaryFesmPath).mtimeMs).to.greaterThan(primaryModifiedTime);
      expect(fs.statSync(secondaryFesmPath).mtimeMs).to.greaterThan(secondaryModifiedTime);
      expect(fs.statSync(thirdFesmPath).mtimeMs).to.equals(thirdModifiedTime);
      done();
    });
  });
});
