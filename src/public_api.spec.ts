import { expect } from 'chai';
// Public API imports the way of user's: 'import {..} from 'ng-packagr'';
import { NgPackagr, build, execute, ngPackagr } from './public_api';

describe("Public API Surface: import {..} from 'ng-packagr';", () => {
  describe('NgPackagr', () => {
    it('should export `ngPackagr()` fluent API', () => {
      expect(ngPackagr).to.be.a('function');
      expect(ngPackagr()).to.be.and.instanceof(NgPackagr);
    });
  });

  describe('Command API', () => {
    it('should export the `build` command', () => {
      expect(build).to.be.a('function');
    });

    it(`should export the command runner 'execute'`, () => {
      expect(execute).to.be.a('function');
    });
  });
});
