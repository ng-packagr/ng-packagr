import { tags } from '@angular-devkit/core';
import * as ts from 'typescript';

export function createSourceFile(
  sourceText: TemplateStringsArray | string,
  fileName: string = 'foo.ts'
): ts.SourceFile {
  if (typeof sourceText !== 'string') {
    sourceText = tags.stripIndent(sourceText);
  }

  return ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.ES5, true, ts.ScriptKind.TS);
}

export function createSourceText(sourceText: TemplateStringsArray) {
  return tags.stripIndent(sourceText);
}
