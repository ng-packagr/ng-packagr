import * as ts from 'typescript';
import { isComponentDecorator, isTemplateUrl, isStyleUrls } from './ng-type-guards';

export type ComponentVisitors = {
  templateVisitor: ts.Transformer<ts.PropertyAssignment>;
  stylesheetVisitor: ts.Transformer<ts.PropertyAssignment>;
};

export const transformComponent = ({ templateVisitor, stylesheetVisitor }: ComponentVisitors) => (
  context: ts.TransformationContext
) => (sourceFile: ts.SourceFile): ts.SourceFile => {
  // skip source files from 'node_modules' directory (third-party source)
  if (sourceFile.fileName.includes('node_modules')) {
    return sourceFile;
  }

  const visitComponentMetadata: ts.Visitor = (node: ts.Decorator) => {
    if (isTemplateUrl(node)) {
      return templateVisitor(node);
    } else if (isStyleUrls(node)) {
      return stylesheetVisitor(node);
    }

    return ts.visitEachChild(node, visitComponentMetadata, context);
  };

  const visitDecorators = (node: ts.Node): ts.Node =>
    isComponentDecorator(node)
      ? ts.visitEachChild(node, visitComponentMetadata, context)
      : ts.visitEachChild(node, visitDecorators, context);

  return ts.visitNode(sourceFile, visitDecorators);
};
