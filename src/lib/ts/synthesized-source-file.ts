import * as ts from 'typescript';

/**
 * An extension to TypeScript source files that allows to replace text spands in the original
 * source text with synthesized source text.
 */
export interface SynthesizedSourceFile extends ts.SourceFile {
  __replacements?: Replacement[];
}

export interface Replacement {
  from: number;
  to: number;
  text: string;
}

export function isSynthesizedSourceFile(sourceFile: ts.SourceFile): sourceFile is SynthesizedSourceFile {
  return sourceFile && sourceFile['__replacements'] instanceof Array;
}

/**
 * Adds a {@link Replacement} marker to the TypeScript source file of `node`. The source text of
 * `node` should be replaced by the `replacement` source text in subsequent processing.
 *
 * @param node The source node that should be replaced
 * @param replacement The synthesized source text that will replace the node.
 */
export function replaceWithSynthesizedSourceText(node: ts.Node, replacement: string): SynthesizedSourceFile {
  const sourceFile = node.getSourceFile() as SynthesizedSourceFile;

  if (!sourceFile.__replacements) {
    sourceFile.__replacements = [];
  }

  sourceFile.__replacements.push({
    from: node.getStart(),
    to: node.getEnd(),
    text: replacement
  });

  return sourceFile;
}

/**
 * Writes TypeScript source text to a string, potentially applying replacements.
 *
 * @param sourceFile TypeScript source file, either original or synthesiized sources
 */
export function writeSourceText(sourceFile: ts.SourceFile | SynthesizedSourceFile): string {
  const originalSource = sourceFile.getFullText();

  if (isSynthesizedSourceFile(sourceFile)) {
    let newSource = '';
    let position = 0;
    for (let replacement of sourceFile.__replacements) {
      newSource = newSource.concat(originalSource.substring(position, replacement.from)).concat(replacement.text);
      position = replacement.to;
    }
    newSource = newSource.concat(originalSource.substring(position));

    return newSource;
  } else {
    return originalSource;
  }
}

/**
 * Writes a TypeScript source file, potentially applying replacements, and returns a 'fresh' source
 * file instance that may be used for later processing.
 *
 * @param sourceFile TypeScript source file, either original or synthesized sources
 */
export function writeSourceFile(sourceFile: ts.SourceFile | SynthesizedSourceFile): ts.SourceFile {
  if (isSynthesizedSourceFile(sourceFile)) {
    const sourceText = writeSourceText(sourceFile);

    return ts.createSourceFile(sourceFile.fileName, sourceText, sourceFile.languageVersion, true, ts.ScriptKind.TS);
  } else {
    return sourceFile;
  }
}
