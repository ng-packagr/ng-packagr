import { expect } from 'chai';
import * as ts from 'typescript';
import { createSourceFile } from './typescript.testing';

describe(`testing: typescript`, () => {
  describe(`createSourceFile()`, () => {
    let sourceFile: ts.SourceFile;
    beforeEach(() => {
      sourceFile = createSourceFile`
        import { Injectable } from '@angular/core';

        @Injectable()
        class MyThingDoer {}
        `;
    });

    it(`should create a .ts source file`, () => {
      expect(sourceFile).to.be.ok;
      expect(ts.isSourceFile(sourceFile)).to.be.true;
    });

    it(`should strip indents from source text`, () => {
      expect(sourceFile.getFullText()).to.satisfy((val: string) => val.startsWith('import {'));
    });
  });
});
