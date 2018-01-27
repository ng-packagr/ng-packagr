import { tags } from '@angular-devkit/core';
import * as ts from 'typescript';

export function createSourceFile(sourceText: TemplateStringsArray, fileName: string = 'foo.ts'): ts.SourceFile {
  return ts.createSourceFile(fileName, tags.stripIndent(sourceText), ts.ScriptTarget.ES5, true, ts.ScriptKind.TS);
}
