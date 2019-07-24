import { expect } from 'chai';

describe(`@sample/embed-assets`, () => {
  describe(`sample-embed-assets.metadata.json`, () => {
    let METADATA;
    before(() => {
      METADATA = require('../dist/sample-embed-assets.metadata.json');
    });

    it(`should exist`, () => {
      expect(METADATA).to.be.ok;
    });

    it(`should embeded the image with 'dataUri'`, () => {
      expect(METADATA['metadata']['AngularComponent']['decorators'][0]['arguments'][0]['styles'][0]).to.contain(
        'data:image/png;base64',
      );
    });
  });
});
