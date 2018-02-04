import * as ts from 'typescript';

export const isComponentDecorator = (node: ts.Node): node is ts.Decorator => {
  if (ts.isDecorator(node)) {
    const callExpression = node.getChildren().find(ts.isCallExpression);
    // callExpression may be undefined, check
    if (callExpression && ts.isCallExpression(callExpression)) {
      const decoratorExpression = callExpression.expression;

      if (ts.isIdentifier(decoratorExpression)) {
        // Accounts for `import { Component } from '@angular/core`
        // and accounts for `import { Component as Foo } from '@angular/core';`
        const identifierText = decoratorExpression.getText();
        const ngCoreImports = resolveImportSymbolsFromModule(node, '@angular/core');

        return ngCoreImports['Component'] === identifierText;
      } else if (ts.isPropertyAccessExpression(decoratorExpression)) {
        // Accounts for `import * as ng from '@angular/core'`;
        const namespaceName = decoratorExpression.expression.getText();
        const namespacePropertyName = decoratorExpression.name.getText();
        const ngCoreImports = resolveImportSymbolsFromModule(node, '@angular/core');

        return namespacePropertyName === 'Component' && namespaceName === ngCoreImports.__namespace;
      }

      return false;
    }
  }

  return false;
};

export const isPropertyAssignmentFor = (node: ts.Node, name: string): node is ts.PropertyAssignment =>
  ts.isPropertyAssignment(node) && node.name.getText() === name;

export const isTemplateUrl = (node: ts.Node): node is ts.PropertyAssignment =>
  isPropertyAssignmentFor(node, 'templateUrl');

export const isStyleUrls = (node: ts.Node): node is ts.PropertyAssignment => isPropertyAssignmentFor(node, 'styleUrls');

export const isImportFromModule = (node: ts.Node, moduleIdentifier: string): node is ts.ImportDeclaration => {
  if (ts.isImportDeclaration(node)) {
    const moduleSpecififer = node.moduleSpecifier.getText();
    const moduleId = moduleSpecififer.substring(1, moduleSpecififer.length - 1);

    return moduleId === moduleIdentifier;
  }

  return false;
};

export const resolveImportSymbolsFromModule = (node: ts.Node, moduleIdentifier: string) => {
  const importSymbols: {
    __namespace?: string;
    [key: string]: string;
  } = {};

  return node
    .getSourceFile()
    .statements.filter(statement => isImportFromModule(statement, moduleIdentifier))
    .map((importDeclaration: ts.ImportDeclaration) => importDeclaration.importClause)
    .reduce((symbols, importClause) => {
      const importNode = importClause.getChildAt(0);
      if (ts.isNamedImports(importNode)) {
        const importSpecifier = importNode.elements;

        for (let specifier of importSpecifier) {
          // Accounts for aliased imports and straight named imports
          const importedFrom = specifier.propertyName ? specifier.propertyName.getText() : specifier.name.getText();
          const importedAs = specifier.name.getText();

          importSymbols[importedFrom] = importedAs;
        }
      } else if (ts.isNamespaceImport(importNode)) {
        const importedAsNamespace = importNode.name.getText();
        importSymbols.__namespace = importedAsNamespace;
      }

      return importSymbols;
    }, importSymbols);
};
