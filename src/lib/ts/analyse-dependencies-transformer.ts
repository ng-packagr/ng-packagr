import * as ts from 'typescript';

export interface DependencyAnalyser {
  (sourceFile: ts.SourceFile, moduleId: string): void;
}

export const analyseDependencies = (analyser: DependencyAnalyser) => (context: ts.TransformationContext) => (
  sourceFile: ts.SourceFile
): ts.SourceFile => {
  // skip source files from 'node_modules' directory (third-party source)
  if (sourceFile.fileName.includes('node_modules')) {
    return sourceFile;
  }

  const findModuleIdFromImport = (node: ts.ImportDeclaration) => {
    const text = node.moduleSpecifier.getText(sourceFile);

    return text.substring(1, text.length - 1);
  };

  const visitImports: ts.Visitor = node => {
    if (ts.isImportDeclaration(node)) {
      // Found an 'import ...' declaration
      const importedModuleId: string = findModuleIdFromImport(node);

      analyser(node.getSourceFile(), importedModuleId);
    } else {
      return ts.visitEachChild(node, visitImports, context);
    }

    return node;
  };

  return ts.visitEachChild(sourceFile, visitImports, context);
};
