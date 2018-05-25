import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`issue-852`, () => {
  describe(`issue-852.metadata.json`, () => {
    let METADATA;
    before(() => {
      METADATA = require('../dist/my-issue-852.metadata.json');
    });

    it(`should exist`, () => {
      expect(METADATA).to.be.ok;
    });

    it(`should be version 4`, () => {
      expect(METADATA.version).to.equal(4);
    });

    it(`should be "__symbolic": "module"`, () => {
      expect(METADATA['__symbolic']).to.equal('module');
    });

    it(`should "importAs": "@my/issue-852"`, () => {
      expect(METADATA['importAs']).to.equal('@my/issue-852');
    });
  });
});
