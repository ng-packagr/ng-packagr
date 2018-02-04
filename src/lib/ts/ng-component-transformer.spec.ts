import { tags } from '@angular-devkit/core';
import { expect } from 'chai';
import * as ts from 'typescript';
import { transformComponentSourceFiles } from './ng-component-transformer';
import { createSourceFile, createSourceText } from '../../testing/typescript.testing';

describe(`transformComponentSourceFiles()`, () => {
  let FOO_SOURCE_FILE: ts.SourceFile;

  beforeEach(() => {
    FOO_SOURCE_FILE = createSourceFile(
      createSourceText`
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
      `,
      '/foo-bar/foo.ts'
    );
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

  it(`should apply string replacements to source text when transformers return string values`, () => {
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

  describe(`stylesheet: StylesheetTransformer`, () => {
    it(`should call the transformer for each value in the styleUrls array`, () => {
      let stylesheetsFound: string[] = [];
      const transformer = transformComponentSourceFiles({
        template: () => {},
        stylesheet: ({ stylePath }) => {
          stylesheetsFound.push(stylePath);
        }
      });

      ts.transform(FOO_SOURCE_FILE, [transformer]);

      expect(stylesheetsFound)
        .to.be.an('array')
        .that.has.length(3);
      expect(stylesheetsFound)
        .to.contain('./foo.component.css')
        .and.to.contain('./more.css')
        .and.to.contain('./even-more.ext');
    });

    it(`should resolve file path of the stylesheet file relative to source file`, () => {
      let stylesheets: any[] = [];
      const transformer = transformComponentSourceFiles({
        template: () => {},
        stylesheet: args => {
          stylesheets.push(args);
        }
      });

      ts.transform(FOO_SOURCE_FILE, [transformer]);

      expect(stylesheets)
        .to.be.an('array')
        .that.has.length(3);
      expect(stylesheets[0]).to.have.property('stylePath', './foo.component.css');
      expect(stylesheets[0]).to.have.property('styleFilePath', '/foo-bar/foo.component.css');
      expect(stylesheets[0]).to.have.property('sourceFilePath', '/foo-bar/foo.ts');
    });
  });

  describe(`template: TemplateTransformer`, () => {
    it(`should call the transformer for the value found in templateUrl`, () => {
      let templatesFound: string[] = [];
      const transformer = transformComponentSourceFiles({
        template: ({ templatePath }) => {
          templatesFound.push(templatePath);
        },
        stylesheet: () => {}
      });

      ts.transform(FOO_SOURCE_FILE, [transformer]);

      expect(templatesFound)
        .to.be.an('array')
        .that.has.length(1);
      expect(templatesFound).to.contain('./foo.component.html');
    });

    it(`should resolve file path of the template file relative to source file`, () => {
      let templates: any[] = [];
      const transformer = transformComponentSourceFiles({
        template: args => {
          templates.push(args);
        },
        stylesheet: () => {}
      });

      ts.transform(FOO_SOURCE_FILE, [transformer]);

      expect(templates)
        .to.be.an('array')
        .that.has.length(1);
      expect(templates[0]).to.have.property('templatePath', './foo.component.html');
      expect(templates[0]).to.have.property('templateFilePath', '/foo-bar/foo.component.html');
      expect(templates[0]).to.have.property('sourceFilePath', '/foo-bar/foo.ts');
    });
  });
});
