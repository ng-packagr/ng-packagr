import { tags } from '@angular-devkit/core';
import { expect } from 'chai';
import * as ts from 'typescript';
import { isComponentDecorator } from './ts-transformers';

const createSourceFile = (sourceText: string, sourceName: string = 'foo.ts') =>
  ts.createSourceFile(sourceName, sourceText, ts.ScriptTarget.ES5, true, ts.ScriptKind.TS);

describe(`ts-transformers`, () => {

  describe(`isComponentDecorator`, () => {
    const sourceFile = createSourceFile(tags.stripIndent`
      import {Component} from '@angular/core';

      @Component({})
      @Other
      class MyComponent {}
    `);

    it(`should return true for '@Component()'`, () => {
      const decoratorNode = sourceFile.getChildAt(0).getChildAt(1).getChildAt(0).getChildAt(0);
      expect(isComponentDecorator(decoratorNode)).to.be.true;
    });

    it(`should return false for other decorator`, () => {
      const otherDecorator = sourceFile.getChildAt(0).getChildAt(1).getChildAt(0).getChildAt(1);
      expect(isComponentDecorator(otherDecorator)).to.be.false;
    });

    it(`should return false for non 'SyntaxKind.Decorator' nodes`, () => {
      const nonDecoratorNode = sourceFile.getChildAt(0);
      expect(isComponentDecorator(nonDecoratorNode)).to.be.false;
    });
  });
});
