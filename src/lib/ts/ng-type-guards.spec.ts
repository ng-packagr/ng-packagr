import { tags } from '@angular-devkit/core';
import { expect } from 'chai';
import * as ts from 'typescript';
import { isComponentDecorator, isTemplateUrl, isStyleUrls } from './ng-type-guards';

const createSourceFile = (sourceText: string, sourceName: string = 'foo.ts') =>
  ts.createSourceFile(sourceName, sourceText, ts.ScriptTarget.ES5, true, ts.ScriptKind.TS);

describe(`ng-type-guards`, () => {
  const sourceFileOne = createSourceFile(tags.stripIndent`
    import {Component} from '@angular/core';

    @Component({})
    @Other
    class MyComponent {}
  `);

  const sourceFileTwo = createSourceFile(tags.stripIndent`
    @Component({
      templateUrl: './my.component.html',
      styleUrls: ['./my.component.css']
    })
    class MyComponent {}
  `);
  const sourceTwo_syntaxList = sourceFileTwo
    .getChildAt(0)
    .getChildAt(0)
    .getChildAt(0)
    .getChildAt(0)
    .getChildAt(1)
    .getChildAt(2)
    .getChildAt(0)
    .getChildAt(1);
  const sourceTwo_templateUrlNode = sourceTwo_syntaxList.getChildAt(0);
  const sourceTwo_styleUrlsNode = sourceTwo_syntaxList.getChildAt(2);

  describe(`isComponentDecorator`, () => {
    it(`should return true for '@Component()'`, () => {
      const decoratorNode = sourceFileOne
        .getChildAt(0)
        .getChildAt(1)
        .getChildAt(0)
        .getChildAt(0);
      expect(isComponentDecorator(decoratorNode)).to.be.true;
    });

    it(`should return false for other decorator`, () => {
      const otherDecorator = sourceFileOne
        .getChildAt(0)
        .getChildAt(1)
        .getChildAt(0)
        .getChildAt(1);
      expect(isComponentDecorator(otherDecorator)).to.be.false;
    });

    it(`should return false for non 'SyntaxKind.Decorator' nodes`, () => {
      const nonDecoratorNode = sourceFileOne.getChildAt(0);
      expect(isComponentDecorator(nonDecoratorNode)).to.be.false;
    });
  });

  describe(`isTemplateUrl`, () => {
    it(`it should return 'true' for 'templateUrl:'`, () => {
      expect(isTemplateUrl(sourceTwo_templateUrlNode)).to.be.true;
    });

    it(`it should return 'false' for other property assignment`, () => {
      expect(isTemplateUrl(sourceTwo_styleUrlsNode)).to.be.false;
    });

    it(`it should return 'false' for other nodes`, () => {
      expect(isTemplateUrl(sourceFileTwo)).to.be.false;
      expect(isTemplateUrl(sourceTwo_syntaxList)).to.be.false;
    });
  });

  describe(`isStyleUrls`, () => {
    it(`it should return 'true' for 'stylesUrls:'`, () => {
      expect(isStyleUrls(sourceTwo_styleUrlsNode)).to.be.true;
    });

    it(`it should return 'false' for other property assignment`, () => {
      expect(isStyleUrls(sourceTwo_templateUrlNode)).to.be.false;
    });

    it(`it should return 'false' for other nodes`, () => {
      expect(isStyleUrls(sourceFileTwo)).to.be.false;
      expect(isStyleUrls(sourceTwo_syntaxList)).to.be.false;
    });
  });
});
