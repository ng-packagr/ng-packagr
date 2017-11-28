import * as ts from 'typescript';
import * as path from 'path';

export const isComponentDecorator =
  (node: ts.Node): node is ts.Decorator =>
    ts.isDecorator(node) && node
      .getChildren().find(ts.isCallExpression)
      .getChildren().find(ts.isIdentifier)
      .getText() === 'Component';
      /* TODO: text comparison can break when
       * `import { Component as foo } from '@angular/core'` or
       * `import * as ng from '@angular/core'`
       * @link https://github.com/angular/devkit/blob/master/packages/schematics/angular/utility/ast-utils.ts#L127-L128
       */

export const isPropertyAssignmentFor =
  (node: ts.Node, name: string): node is ts.PropertyAssignment =>
    ts.isPropertyAssignment(node) && node.name.getText() === name;

export const isTemplateUrl =
  (node: ts.Node): node is ts.PropertyAssignment => isPropertyAssignmentFor(node, 'templateUrl');

export const isStyleUrls =
  (node: ts.Node): node is ts.PropertyAssignment => isPropertyAssignmentFor(node, 'styleUrls');

export type StylesheetProcessor = (sourceFile: string, styleUrl: string, styleFilePath: string) => string | undefined | void;

export type TemplateProcessor = (sourceFile: string, templateUrl: string, templateFilePath: string) => string | undefined | void;

export type ComponentTransformer =
  ({}: {templateProcessor: TemplateProcessor, stylesheetProcessor: StylesheetProcessor}) => ts.TransformerFactory<ts.SourceFile>;

export const componentTransformer: ComponentTransformer =
  ({ templateProcessor, stylesheetProcessor }) =>
    (context: ts.TransformationContext) => (sourceFile: ts.SourceFile): ts.SourceFile => {
      // skip source files from 'node_modules' directory (third-party source)
      if (sourceFile.fileName.includes('node_modules')) {
        return sourceFile;
      }

      const visitComponents = (node: ts.Decorator): ts.Node => {
        if (isTemplateUrl(node)) {
          // XX: strip quotes (' or ") from path
          const templatePath = node.initializer.getText().substring(1, node.initializer.getText().length - 1);
          const sourceFilePath = sourceFile.fileName;
          const templateFilePath = path.resolve(path.dirname(sourceFilePath), templatePath);
          const template = templateProcessor(sourceFilePath, templatePath, templateFilePath);

          if (typeof template === 'string') {
            return ts.updatePropertyAssignment(
              node,
              ts.createIdentifier('template'),
              ts.createLiteral(template)
            );
          } else {
            return node;
          }
        } else if (isStyleUrls(node)) {
          // handle array arguments for styleUrls
          const styleUrls = node.initializer.getChildren()
            .filter((node) => node.kind === ts.SyntaxKind.SyntaxList)
            .map((node) => node.getChildren().map(n => n.getText()))
            .reduce((prev, current) => prev.concat(...current), [])
            .map((url) => url.substring(1, url.length - 1));

          const stylesheets = styleUrls.map((url: string) => {
            const sourceFilePath = sourceFile.fileName;
            const styleFilePath = path.resolve(path.dirname(sourceFilePath), url);
            const template = stylesheetProcessor(sourceFilePath, url, styleFilePath);

            return typeof template === 'string' ? template : url;
          });

          const hasChanged = stylesheets.every((value, index) => {
            return styleUrls[index] && styleUrls[index] !== value;
          });

          if (hasChanged) {
            return ts.updatePropertyAssignment(
              node,
              ts.createIdentifier('styles'),
              ts.createArrayLiteral(
                stylesheets.map((value) => ts.createLiteral(value))
              )
            )
          } else {
            return node;
          }
        }

        return ts.visitEachChild(node, visitComponents, context);
      };

      const visitDecorators = (node: ts.Node): ts.Node =>
        isComponentDecorator(node)
          ? ts.visitEachChild(node, visitComponents, context)
          : ts.visitEachChild(node, visitDecorators, context);

      return ts.visitNode(sourceFile, visitDecorators);
    }
