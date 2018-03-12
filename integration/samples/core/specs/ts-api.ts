import { expect } from 'chai';
import { Foo, Bar } from '../dist/sample-core';

describe(`@sample/core`, () => {
  describe(`TypeScript API surface (from '*.d.ts')`, () => {
    it(`export { Foo, Bar }`, () => {
      const foo: Foo = { foo: 123 };
      const bar: Bar = { bar: '123' };

      expect(foo.foo).to.equal(123);
      expect(bar.bar).to.equal('123');
    });
  });
});
