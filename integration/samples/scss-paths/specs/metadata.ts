import { expect } from 'chai';

describe(`@sample/scss-paths`, () => {

  describe(`sample-scss-paths.metadata.json`, () => {
    let METADATA;
    before(() => {
      METADATA = require('../dist/sample-scss-paths.metadata.json');
    });

    it(`should exist`, () => {
      expect(METADATA).to.be.ok;
    });

    it(`should "importAs": "@sample/scss-paths"`, () => {
      expect(METADATA['importAs']).to.equal('@sample/scss-paths');
    });

    it(`should resolve the styles from the theme`, () => {
      const styles = METADATA['metadata']['BazComponent']['decorators'][0]['arguments'][0]['styles'][0];
      expect(styles).to.contain(`color:"red"`);
      expect(styles).to.contain(`background-color:"yellow"`);
    });
  });

  describe(`scss-paths-sub-module.metadata.json`, () => {
    let METADATA;
    before(() => {
      METADATA = require('../dist/sub-module/sample-scss-paths-sub-module.metadata.json');
    });

    it(`should exist`, () => {
      expect(METADATA).to.be.ok;
    });

    it(`should "importAs": "@sample/scss-paths/sub-module"`, () => {
      expect(METADATA['importAs']).to.equal('@sample/scss-paths/sub-module');
    });

    it(`should resolve the styles from the parent theme`, () => {
      const styles = METADATA['metadata']['BarComponent']['decorators'][0]['arguments'][0]['styles'][0];
      expect(styles).to.contain(`background-color:"yellow"`);
    });

    it(`should resolve the styles from the sub-module common utilities`, () => {
      const styles = METADATA['metadata']['BarComponent']['decorators'][0]['arguments'][0]['styles'][0];
      expect(styles).to.contain(`border:10px solid "yellow"`);
    });
  });
});
