import { expect } from 'chai';
import * as ts from 'typescript';
import { isComponentDecorator } from './ts-transformers';

describe(`ts-transformers`, () => {

  describe(`isComponentDecorator`, () => {
    const sourceFile = ts.createSourceFile('foo.ts',
      `import {Component} from '@angular/core'; @Component({})class MyComponent{} @Directive()class Foo{}`,
      ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const decoratorNode = sourceFile.getChildAt(0).getChildAt(1)
      .getChildAt(0).getChildAt(0);

    it(`should return true for '@Component()'`, () => {
      expect(isComponentDecorator(decoratorNode)).to.be.true;
    });

    it(`should return false for other decorator`, () => {
      const otherDecorator = sourceFile.getChildAt(0).getChildAt(2)
        .getChildAt(0).getChildAt(0);
      expect(isComponentDecorator(otherDecorator)).to.be.false;
    });

    it(`should return false for non 'SyntaxKind.Decorator' nodes`, () => {
      const nonDecoratorNode = sourceFile.getChildAt(0);
      expect(isComponentDecorator(nonDecoratorNode)).to.be.false;
    });
  });
});
