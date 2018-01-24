import * as ts from 'typescript';

export const isComponentDecorator = (node: ts.Node): node is ts.Decorator => {
  if (ts.isDecorator(node)) {
    const callExpression = node.getChildren().find(ts.isCallExpression);
    if (callExpression) {
      const identifier = callExpression.getChildren().find(ts.isIdentifier);

      return identifier && identifier.getText() === 'Component';
      /* TODO: text comparison can break when
        * `import { Component as foo } from '@angular/core'` or
        * `import * as ng from '@angular/core'`
        * @link https://github.com/angular/devkit/blob/master/packages/schematics/angular/utility/ast-utils.ts#L127-L128
        */
    }
  }

  return false;
};

export const isPropertyAssignmentFor = (node: ts.Node, name: string): node is ts.PropertyAssignment =>
  ts.isPropertyAssignment(node) && node.name.getText() === name;

export const isTemplateUrl = (node: ts.Node): node is ts.PropertyAssignment =>
  isPropertyAssignmentFor(node, 'templateUrl');

export const isStyleUrls = (node: ts.Node): node is ts.PropertyAssignment => isPropertyAssignmentFor(node, 'styleUrls');
