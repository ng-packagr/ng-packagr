import * as ts from 'typescript';

export interface DependencyAnalyser {
  (sourceFile: ts.SourceFile, moduleId: string): void;
}

export const analyseDependencies = (analyser: DependencyAnalyser) => (context: ts.TransformationContext) => (
  sourceFile: ts.SourceFile
): ts.SourceFile => {
  // skip source files from 'node_modules' directory (third-party source)
  // 'ngfactory' and 'ngstyles' should also be skipped
  if (/node_modules|\.ngfactory|\.ngstyle/.test(sourceFile.fileName)) {
    return sourceFile;
  }

  const findModuleIdFromImport = (node: ts.ImportDeclaration) => {
    const text = node.moduleSpecifier.getText();

    return text.substring(1, text.length - 1);
  };

  const findModuleIdFromExport = (node: ts.ExportDeclaration) => {
    if (!node.moduleSpecifier) {
      return undefined;
    }

    const text = node.moduleSpecifier.getText();

    return text.substring(1, text.length - 1);
  };

  const visitImports: ts.Visitor = node => {
    if (ts.isImportDeclaration(node)) {
      // Found an 'import ...' declaration
      const importedModuleId: string = findModuleIdFromImport(node);
      analyser(node.getSourceFile(), importedModuleId);
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      // Found an 'export ... from ...' declaration
      const importedModuleId: string = findModuleIdFromExport(node);
      analyser(node.getSourceFile(), importedModuleId);
    } else {
      return ts.visitEachChild(node, visitImports, context);
    }

    return node;
  };

  return ts.visitEachChild(sourceFile, visitImports, context);
};
