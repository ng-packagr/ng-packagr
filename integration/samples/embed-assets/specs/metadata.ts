import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/embed-assets`, () => {

  describe(`embed-assets.metadata.json`, () => {
    let METADATA;
    before(() => {
      METADATA = METADATA = require('../dist/embed-assets.metadata.json');
    });

    it(`should exist`, () => {
      expect(METADATA).to.be.ok;
    });

    it(`should embeded the image with 'dataUri'`, () => {
      expect(METADATA['metadata']['AngularComponent']['decorators'][0]['arguments'][0]['styles'][0])
        .to.contain("data:image/png;base64");
    });
  });

});
