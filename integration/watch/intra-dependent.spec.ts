import { expect } from 'chai';
import * as fs from 'fs';
import { TestHarness } from './test-harness';

describe('intra-dependent', () => {
  const harness = new TestHarness('intra-dependent');

  beforeAll(async () => {
    await harness.initialize();
  });

  afterEach(async () => {
    await harness.reset();
  });

  afterAll(() => {
    harness.dispose();
  });

  it("should perform initial compilation when 'watch' is started", () => {
    harness.expectDtsToMatch('src/primary.component', /count: number/);
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

  // TODO: we should find a better way to determine which sub-entry points have been re-built.
  // Using timestamps is not accurate.
  xit('should only build entrypoints that are dependent on the file changed.', done => {
    const primaryEsmPath = harness.getFilePath('esm2020/intra-dependent.mjs');
    const secondaryEsmPath = harness.getFilePath('esm2020/secondary/intra-dependent-secondary.mjs');
    const thirdesmPath = harness.getFilePath('esm2020/third/intra-dependent-third.mjs');

    const primaryModifiedTime = fs.statSync(primaryEsmPath).mtimeMs;
    const secondaryModifiedTime = fs.statSync(secondaryEsmPath).mtimeMs;
    const thirdModifiedTime = fs.statSync(thirdesmPath).mtimeMs;
    harness.copyTestCase('valid');

    harness.onComplete(() => {
      expect(fs.statSync(primaryEsmPath).mtimeMs).to.greaterThan(primaryModifiedTime);
      expect(fs.statSync(secondaryEsmPath).mtimeMs).to.greaterThan(secondaryModifiedTime);
      expect(fs.statSync(thirdesmPath).mtimeMs).to.equals(thirdModifiedTime);
      done();
    });
  });

  it('should fail when introducing a circular import.', done => {
    harness.copyTestCase('circular');

    harness.onFailure(error => {
      expect(error.message).to.contain('Entry point intra-dependent has a circular dependency on itself.');
      done();
    });
  });
});
