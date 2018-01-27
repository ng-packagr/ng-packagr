import { tags } from '@angular-devkit/core';
import { expect } from 'chai';
import * as ts from 'typescript';
import { createSourceFile } from '../../testing/typescript.testing';
import {
  SynthesizedSourceFile,
  isSynthesizedSourceFile,
  replaceWithSynthesizedSourceText,
  writeSourceFile,
  writeSourceText
} from './synthesized-source-file';

describe('SynthesizedSourceFile', () => {
  let mockSourceFile: ts.SourceFile;
  let mockNode: ts.Node;

  beforeEach(() => {
    mockSourceFile = createSourceFile`
      import {Component} from '@angular/core';

      @Component({})
      @Other
      class MyComponent {}
    `;

    mockNode = mockSourceFile
      .getChildAt(0)
      .getChildAt(1)
      .getChildAt(0)
      .getChildAt(0);
  });

  describe(`isSynthesizedSourceFile()`, () => {
    it(`should return true, if magic __replacements property is array`, () => {
      const foo = ({
        __replacements: []
      } as any) as ts.SourceFile;

      expect(isSynthesizedSourceFile(foo)).to.be.true;
    });

    it(`should return false, if magic __replacements property is non-array`, () => {
      const foo = ({
        __replacements: 123
      } as any) as ts.SourceFile;

      expect(isSynthesizedSourceFile(foo)).to.be.false;
    });

    it(`should return false, if no magic __replacements property`, () => {
      const foo = ({} as any) as ts.SourceFile;

      expect(isSynthesizedSourceFile(foo)).to.be.false;
    });
  });

  describe(`replaceWithSynthesizedSourceText()`, () => {
    it(`should add a replacement`, () => {
      const result = replaceWithSynthesizedSourceText(mockNode, 'bar');
      expect(result.__replacements)
        .to.be.an('array')
        .that.has.length(1);

      expect(result.__replacements[0].from).to.equal(mockNode.getStart());
      expect(result.__replacements[0].to).to.equal(mockNode.getEnd());
      expect(result.__replacements[0].text).to.equal('bar');
    });
  });

  describe(`writeSourceText()`, () => {
    it(`should return the original source text, if no replacement`, () => {
      expect(writeSourceText(mockSourceFile)).to.equal(mockSourceFile.getFullText());
    });

    it(`should write the replacements of the source file`, () => {
      const synthesized = mockSourceFile as SynthesizedSourceFile;
      synthesized.__replacements = [
        {
          from: 7,
          to: 18,
          text: '* as ng'
        }
      ];

      expect(writeSourceText(synthesized)).to.equal(tags.stripIndent`
        import * as ng from '@angular/core';

        @Component({})
        @Other
        class MyComponent {}
      `);
    });

    it(`should write out synthetic source text replacements`, () => {
      const synthesizedSource = replaceWithSynthesizedSourceText(mockNode, 'foobar');
      expect(writeSourceText(synthesizedSource)).to.equal(tags.stripIndent`
        import {Component} from '@angular/core';

        foobar
        @Other
        class MyComponent {}
      `);
    });
  });

  describe(`writeSourceFile()`, () => {
    it(`should return the original file, if no replacements`, () => {
      expect(writeSourceFile(mockSourceFile)).to.equal(mockSourceFile);
    });
  });
});
