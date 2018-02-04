import { expect } from 'chai';
import * as ts from 'typescript';
import { transformComponent, ComponentTransformer } from './transform-component';
import { createSourceFile } from '../../testing/typescript.testing';

describe(`transformComponent()`, () => {
  let FOO_SOURCE_FILE: ts.SourceFile;

  beforeEach(() => {
    FOO_SOURCE_FILE = createSourceFile`
      import { Component } from '@angular/core';

      @Component({
        selector: 'foo',
        template: '<h1>foobar</h1>',
        templateUrl: './foo.component.html',
        providers: [],
        styleUrls: ['./foo.component.css'],
        styles: ['not-of-interest', 'also-not']
      })
      export class FooComponent {}
      `;
  });

  it(`should call templateUrl/styleUrls transformer with property assignment`, () => {
    let callCountTemplateUrl = 0;
    let callCountStyleUrls = 0;
    const transformer = transformComponent({
      templateUrl: node => {
        expect(node.kind).to.equal(ts.SyntaxKind.PropertyAssignment);
        expect(node.getText()).to.equal(`templateUrl: './foo.component.html'`);
        callCountTemplateUrl += 1;

        return node;
      },
      styleUrls: node => {
        expect(node.kind).to.equal(ts.SyntaxKind.PropertyAssignment);
        expect(node.getText()).to.equal(`styleUrls: ['./foo.component.css']`);
        callCountStyleUrls += 1;

        return node;
      }
    });

    ts.transform(FOO_SOURCE_FILE, [transformer]);

    expect(callCountTemplateUrl).to.equal(1);
    expect(callCountStyleUrls).to.equal(1);
  });
});
