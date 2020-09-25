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

    it(`should resolve the styles from the SCSS theme`, () => {
      const scssStyles = METADATA['metadata']['BazComponent']['decorators'][0]['arguments'][0]['styles'][0];
      expect(scssStyles).to.contain(`color:red`);
      expect(scssStyles).to.contain(`background-color:#ff0`);
    });

    it(`should autoprefix scss based on the config in .browserslistrc`, () => {
      const scssStyles = METADATA['metadata']['BazComponent']['decorators'][0]['arguments'][0]['styles'][0];
      expect(scssStyles).to.contain(`display:flex`);
      expect(scssStyles).to.contain(`display:-ms-flexbox`);
    });

    it(`should resolve the styles from the Less theme`, () => {
      const lessStyles = METADATA['metadata']['BazComponent']['decorators'][0]['arguments'][0]['styles'][1];
      expect(lessStyles).to.contain(`.baz .oom`);
      expect(lessStyles).to.contain(`color:red`);
    });

    xit(`should resolve the styles from the Less 'node_module' file ~`, () => {
      const lessStyles = METADATA['metadata']['BazComponent']['decorators'][0]['arguments'][0]['styles'][1];
      expect(lessStyles).to.contain(`tst3`);
    });

    it(`should resolve the styles from the Stylus theme`, () => {
      const stylusStyles = METADATA['metadata']['BazComponent']['decorators'][0]['arguments'][0]['styles'][2];
      expect(stylusStyles).to.contain(`font-size:32pt`);
    });

    it(`should resolve the styles from the SASS theme`, () => {
      const scssStyles = METADATA['metadata']['BazComponent']['decorators'][0]['arguments'][0]['styles'][0];
      expect(scssStyles).to.contain(`color:#00f`);
      expect(scssStyles).to.contain(`background-color:#ff0`);
    });

    it(`should autoprefix sass based on the config in .browserslistrc`, () => {
      const scssStyles = METADATA['metadata']['BazComponent']['decorators'][0]['arguments'][0]['styles'][3];
      expect(scssStyles).to.contain(`display:flex`);
      expect(scssStyles).to.contain(`display:-ms-flexbox`);
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

    it(`should resolve the SCSS styles from the parent theme`, () => {
      const scssStyles = METADATA['metadata']['BarComponent']['decorators'][0]['arguments'][0]['styles'][0];
      expect(scssStyles).to.contain(`background-color:#ff0`);
    });

    it(`should resolve the SCSS styles from the sub-module common utilities`, () => {
      const scssStyles = METADATA['metadata']['BarComponent']['decorators'][0]['arguments'][0]['styles'][0];
      expect(scssStyles).to.contain(`border:10px solid #ff0`);
    });

    it(`should resolve the Less styles from the parent theme`, () => {
      const lessStyles = METADATA['metadata']['BarComponent']['decorators'][0]['arguments'][0]['styles'][1];
      expect(lessStyles).to.contain(`color:red`);
    });

    it(`should resolve the Less styles from the sub-module common utilities`, () => {
      const lessStyles = METADATA['metadata']['BarComponent']['decorators'][0]['arguments'][0]['styles'][1];
      expect(lessStyles).to.contain(`font-weight:700`);
    });

    it(`should resolve the Stylus styles from the parent theme`, () => {
      const stylusStyles = METADATA['metadata']['BarComponent']['decorators'][0]['arguments'][0]['styles'][2];
      expect(stylusStyles).to.contain(`font-size:32pt`);
    });

    it(`should resolve the Stylus styles from the sub-module common utilities`, () => {
      const stylusStyles = METADATA['metadata']['BarComponent']['decorators'][0]['arguments'][0]['styles'][2];
      expect(stylusStyles).to.contain(`font-face:sans-serif`);
    });

    it(`should resolve the SASS styles from the parent theme`, () => {
      const scssStyles = METADATA['metadata']['BarComponent']['decorators'][0]['arguments'][0]['styles'][3];
      expect(scssStyles).to.contain(`background-color:#ff0`);
    });

    it(`should resolve the SASS styles from the sub-module common utilities`, () => {
      const scssStyles = METADATA['metadata']['BarComponent']['decorators'][0]['arguments'][0]['styles'][3];
      expect(scssStyles).to.contain(`border:10px solid #ff0`);
    });
  });
});
