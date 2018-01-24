import { expect } from 'chai';
import { externalModuleIdStrategy } from './external-module-id-strategy';

describe(`rollup`, () => {
  describe(`externalModuleIdStrategy()`, () => {
    it(`should return 'false' paths starting with '.'`, () => {
      expect(externalModuleIdStrategy('./foo/bar')).to.be.false;
    });

    it(`should return 'false' for paths starting with '/'`, () => {
      expect(externalModuleIdStrategy('/foo/bar')).to.be.false;
    });

    it(`should return 'false' for absolute paths`, () => {
      expect(externalModuleIdStrategy(__filename)).to.be.false;
    });

    it(`should return 'false' for embedded modules`, () => {
      expect(externalModuleIdStrategy('lodash', ['lodash'])).to.be.false;
    });

    it(`should return 'false' for 'commonjsHelpers'`, () => {
      expect(externalModuleIdStrategy('commonjsHelpers')).to.be.false;
    });

    it(`should return 'true' for external modules like '@angular/core'`, () => {
      expect(externalModuleIdStrategy('@angular/core')).to.be.true;
    });

    it(`should return 'true' for modules with '.' like 'ui.core'`, () => {
      expect(externalModuleIdStrategy('ui.core')).to.be.true;
    });
  });
});
