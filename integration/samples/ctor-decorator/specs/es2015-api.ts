import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/ctor-decorator`, () => {
  describe(`fesm2015/ctor-decorator.js`, () => {
    let BUNDLE;

    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '../dist/fesm2015/sample-ctor-decorator.js'), 'utf-8');
    });

    it('should exist', () => {
      expect(BUNDLE).to.be.ok;
    });

    it('should contain ctorParameters and __decorate', () => {
      expect(BUNDLE).to.contain('type: ChangeDetectorRef');
      expect(BUNDLE).to.contain('__decorate');
      expect(BUNDLE).to.contain('ctorParameters');
    });

    it('should not contain any __metadata', () => {
      expect(BUNDLE).not.to.contain('__metadata');
    });

    it('should contain import to type used for DI (HttpClient)', () => {
      expect(BUNDLE).to.contain(`import { HttpClientModule, HttpClient } from '@angular/common/http'`);
    });
  });
});
