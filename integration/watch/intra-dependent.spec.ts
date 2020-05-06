import { expect } from 'chai';
import * as fs from 'fs';
import { TestHarness } from './test-harness';

describe('intra-dependent', () => {
  const harness = new TestHarness('intra-dependent');

  before(async () => {
    await harness.initialize();
  });

  afterEach(() => {
    harness.reset();
  });

  after(() => {
    harness.dispose();
  });

  it("should perform initial compilation when 'watch' is started", () => {
    harness.expectDtsToMatch('src/primary.component', /count: number/);
    harness.expectFesm2015ToMatch('intra-dependent-secondary', /count = 100/);
  });

  it('should throw error component inputs is changed without updating usages', (done) => {
    harness.copyTestCase('invalid-component-property');

    harness.onFailure((error) => {
      expect(error.message).to.match(/Can\'t bind to \'count\' since it isn\'t a known property/);
      harness.copyTestCase('valid');
      done();
    });
  });

  it('should throw error service method is changed without updating usages', (done) => {
    harness.copyTestCase('invalid-service-method');

    harness.onFailure((error) => {
      expect(error.message).to.match(/Property \'initialize\' does not exist on type \'PrimaryAngularService\'/);
      harness.copyTestCase('valid');
      done();
    });
  });

  it('should only build entrypoints that are dependent on the file changed.', (done) => {
    const primaryFesmPath = harness.getFilePath('fesm2015/intra-dependent.js');
    const secondaryFesmPath = harness.getFilePath('fesm2015/intra-dependent-secondary.js');
    const thirdFesmPath = harness.getFilePath('fesm2015/intra-dependent-third.js');

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
