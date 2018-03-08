import { expect } from 'chai';
import * as ts from 'typescript';
import { createSourceFile } from '../../testing/typescript.testing';
import {
  isComponentDecorator,
  isTemplateUrl,
  isStyleUrls,
  resolveImportSymbolsFromModule,
  isImportFromModule
} from './ng-ts-ast';

describe(`Angular TypeScript AST (ng-ts-ast)`, () => {
  describe(`isComponentDecorator()`, () => {
    const sourceFileNamedImport = createSourceFile`
      import { Component } from '@angular/core';

      @Component({})
      @Other
      class MyComponent {}
    `;

    it(`should return false for other decorator`, () => {
      const otherDecorator = sourceFileNamedImport
        .getChildAt(0)
        .getChildAt(1)
        .getChildAt(0)
        .getChildAt(1);
      expect(isComponentDecorator(otherDecorator)).to.be.false;
    });

    it(`should return false for non 'SyntaxKind.Decorator' nodes`, () => {
      const nonDecoratorNode = sourceFileNamedImport.getChildAt(0);
      expect(isComponentDecorator(nonDecoratorNode)).to.be.false;
    });

    it("should return true for `import { Component } from '@angular/core'`", () => {
      const decoratorNode = sourceFileNamedImport
        .getChildAt(0)
        .getChildAt(1)
        .getChildAt(0)
        .getChildAt(0);
      expect(isComponentDecorator(decoratorNode)).to.be.true;
    });

    it("should return true for `import { Component as Foo } from '@angular/core'`", () => {
      const sourceFile = createSourceFile`
        import { Component as Foo } from '@angular/core';

        @Foo({
          selector: 'foo',
          template: '<h1>Hey yo, I am from an aliased, named import</h1>'
        })
        export class FooComponent {}
      `;
      const decoratorNode = sourceFile
        .getChildAt(0)
        .getChildAt(1)
        .getChildAt(0)
        .getChildAt(0);

      expect(isComponentDecorator(decoratorNode)).to.be.true;
    });

    it("should return true for `import * as ngCore from '@angular/core'`", () => {
      const sourceFile = createSourceFile`
        import * as ngCore from '@angular/core';

        @ngCore.Component({
          selector: 'foo',
          template: '<h1>Hey yo, I am from a namespace import</h1>'
        })
        export class FooComponent {}
      `;
      const decoratorNode = sourceFile
        .getChildAt(0)
        .getChildAt(1)
        .getChildAt(0)
        .getChildAt(0);

      expect(isComponentDecorator(decoratorNode)).to.be.true;
    });
  });

  const sourceFileComponentTemplateUrlAndStyleUrl = createSourceFile`
    @Component({
      templateUrl: './my.component.html',
      styleUrls: ['./my.component.css']
    })
    class MyComponent {}
  `;
  const sourceTwo_syntaxList = sourceFileComponentTemplateUrlAndStyleUrl
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

  describe(`isTemplateUrl()`, () => {
    it(`it should return 'true' for 'templateUrl:'`, () => {
      expect(isTemplateUrl(sourceTwo_templateUrlNode)).to.be.true;
    });

    it(`it should return 'false' for other property assignment`, () => {
      expect(isTemplateUrl(sourceTwo_styleUrlsNode)).to.be.false;
    });

    it(`it should return 'false' for other nodes`, () => {
      expect(isTemplateUrl(sourceFileComponentTemplateUrlAndStyleUrl)).to.be.false;
      expect(isTemplateUrl(sourceTwo_syntaxList)).to.be.false;
    });
  });

  describe(`isStyleUrls()`, () => {
    it(`it should return 'true' for 'stylesUrls:'`, () => {
      expect(isStyleUrls(sourceTwo_styleUrlsNode)).to.be.true;
    });

    it(`it should return 'false' for other property assignment`, () => {
      expect(isStyleUrls(sourceTwo_templateUrlNode)).to.be.false;
    });

    it(`it should return 'false' for other nodes`, () => {
      expect(isStyleUrls(sourceFileComponentTemplateUrlAndStyleUrl)).to.be.false;
      expect(isStyleUrls(sourceTwo_syntaxList)).to.be.false;
    });
  });

  describe(`isImportFromModule()`, () => {
    const IMPORTS = createSourceFile`
      import { Component as FooBar } from '@angular/core';
      import { Component } from '@angular/core';
      import * as ng from '@angular/core';
      `;
    const ALIAS_IMPORT = IMPORTS.getChildAt(0).getChildAt(0);
    const NAMED_IMPORT = IMPORTS.getChildAt(0).getChildAt(1);
    const NAMESPACED_IMPORT = IMPORTS.getChildAt(0).getChildAt(2);

    it("should detect named imports: `import { foo as bar } from 'foo'`", () => {
      expect(isImportFromModule(ALIAS_IMPORT, '@angular/core')).to.be.true;
      expect(isImportFromModule(ALIAS_IMPORT, 'foo-bar')).to.be.false;
    });

    it("should detect named imports: `import { foo } from 'foo'`", () => {
      expect(isImportFromModule(NAMED_IMPORT, '@angular/core')).to.be.true;
      expect(isImportFromModule(NAMED_IMPORT, 'foo-bar')).to.be.false;
    });

    it("should detect namespace imports: `import * as foo from 'foo'`", () => {
      expect(isImportFromModule(NAMESPACED_IMPORT, '@angular/core')).to.be.true;
      expect(isImportFromModule(NAMESPACED_IMPORT, 'foo-bar')).to.be.false;
    });

    it(`should return false for non-import declaration nodes`, () => {
      expect(isImportFromModule(IMPORTS, 'foo')).to.be.false;
    });
  });

  describe(`resolveImportSymbolsFromModule()`, () => {
    const IMPORTS = createSourceFile`
      import { Component as FooBar } from '@angular/core';
      import { Directive } from '@angular/core';
      import * as ngCore from '@angular/core';
      import foo from 'foo-bar';

      export class FooBar {}
      `;
    const FOO_BAR_CLASS_NODE = IMPORTS.getChildAt(0).getChildAt(4);

    it("should resolve a namespace `import * as foo` to '__namespace' property with value 'foo'", () => {
      const imports = resolveImportSymbolsFromModule(FOO_BAR_CLASS_NODE, '@angular/core');
      expect(imports.__namespace).to.equal('ngCore');
    });

    it('should resolve an aliased import: `import { Foo as Bar }`', () => {
      const imports = resolveImportSymbolsFromModule(FOO_BAR_CLASS_NODE, '@angular/core');
      expect(imports['Component']).to.equal('FooBar');
    });

    it('should resolve a named import: `import { Foo }`', () => {
      const imports = resolveImportSymbolsFromModule(FOO_BAR_CLASS_NODE, '@angular/core');
      expect(imports['Directive']).to.equal('Directive');
    });

    it(`must not resolve import symbols from other symbols`, () => {
      const imports = resolveImportSymbolsFromModule(FOO_BAR_CLASS_NODE, '@angular/core');
      expect(imports['foo']).to.be.undefined;
    });

    it(`must not contain import symbols from non-imported-modules`, () => {
      const imports = resolveImportSymbolsFromModule(FOO_BAR_CLASS_NODE, 'non-imported-module');
      expect(imports.__namespace).to.be.undefined;
      expect(Object.keys(imports))
        .to.be.an('array')
        .that.has.length(0);
    });
  });
});
