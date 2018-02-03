import { tags } from '@angular-devkit/core';
import { expect } from 'chai';
import * as ts from 'typescript';
import { transformComponentSourceFiles } from './ng-component-transformer';
import { createSourceFile } from '../../testing/typescript.testing';

describe(`transformComponentSourceFiles()`, () => {
  let FOO_SOURCE_FILE: ts.SourceFile;

  beforeEach(() => {
    FOO_SOURCE_FILE = createSourceFile`
      import { Component } from '@angular/core';

      @Component({
        selector: 'foo',
        template: '<h1>foobar</h1>',
        templateUrl: './foo.component.html',
        providers: [],
        styleUrls: ['./foo.component.css', './more.css', './even-more.ext'],
        styles: ['not-of-interest', 'also-not']
      })
      export class FooComponent {}
      `;
  });

  it(`must not alter the AST when TemplateTransformer/StylesheetTransformer return void`, () => {
    const transformer = transformComponentSourceFiles({
      template: () => {},
      stylesheet: () => {}
    });

    const fooSourceTransformed = ts
      .transform(FOO_SOURCE_FILE, [transformer])
      .transformed.find(sourceFile => sourceFile.fileName === FOO_SOURCE_FILE.fileName);

    expect(fooSourceTransformed).to.equal(FOO_SOURCE_FILE);
    expect(fooSourceTransformed.flags & ts.NodeFlags.Synthesized).to.equal(0);
  });

  it(`should alter the AST when TemplateTransformer/StylesheetTransformer return string replacements`, () => {
    const transformer = transformComponentSourceFiles({
      template: () => {
        return 'templateFoo';
      },
      stylesheet: () => {
        return 'styleBar';
      }
    });

    const fooSourceTransformed = ts
      .transform(FOO_SOURCE_FILE, [transformer])
      .transformed.filter(sourceFile => sourceFile.fileName === FOO_SOURCE_FILE.fileName);

    expect(fooSourceTransformed)
      .to.be.an('array')
      .that.has.length(1);
    expect(fooSourceTransformed[0]).to.not.equal(FOO_SOURCE_FILE);
  });

  it(`should apply string replacements to source text`, () => {
    const templateReplacer = 'templateFoo';
    const styleReplacer = 'styleBar';
    const transformer = transformComponentSourceFiles({
      template: () => {
        return templateReplacer;
      },
      stylesheet: () => {
        return styleReplacer;
      }
    });

    const fooSourceTransformed = ts
      .transform(FOO_SOURCE_FILE, [transformer])
      .transformed.find(sourceFile => sourceFile.fileName === FOO_SOURCE_FILE.fileName);

    const templateReplacerWithBackticks = '`' + templateReplacer + '`';
    const styleReplacerWithBackticks = '`' + styleReplacer + '`';
    expect(fooSourceTransformed.getText()).to.equal(tags.stripIndent`
      import { Component } from '@angular/core';

      @Component({
        selector: 'foo',
        template: '<h1>foobar</h1>',
        template: ${templateReplacerWithBackticks},
        providers: [],
        styles: [${styleReplacerWithBackticks}, ${styleReplacerWithBackticks}, ${styleReplacerWithBackticks}],
        styles: ['not-of-interest', 'also-not']
      })
      export class FooComponent {}
      `);
  });
});
