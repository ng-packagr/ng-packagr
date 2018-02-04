import * as ts from 'typescript';
import { isComponentDecorator, isTemplateUrl, isStyleUrls } from './ng-type-guards';

/**
 * A transformer that updates the metadata for Angular `@Component({})` decorators.
 */
export type ComponentTransformer = {
  /** TypeScript transformer to update the property assignment for `templateUrl: '..'`. */
  templateUrl: ts.Transformer<ts.PropertyAssignment>;

  /** TypeScript transformer to update the property assignment for `styleUrls: []`. */
  styleUrls: ts.Transformer<ts.PropertyAssignment>;

  /** TypeScript transformer to update the source file. */
  file?: ts.Transformer<ts.SourceFile>;
};

export const transformComponent: (
  transformer: ComponentTransformer
) => ts.TransformerFactory<ts.SourceFile> = transformer => context => sourceFile => {
  // skip source files from 'node_modules' directory (third-party source)
  if (sourceFile.fileName.includes('node_modules')) {
    return sourceFile;
  }

  const visitComponentMetadata: ts.Visitor = (node: ts.Decorator) => {
    if (isTemplateUrl(node)) {
      return transformer.templateUrl(node);
    } else if (isStyleUrls(node)) {
      return transformer.styleUrls(node);
    }

    return ts.visitEachChild(node, visitComponentMetadata, context);
  };

  const visitDecorators = (node: ts.Node): ts.Node =>
    isComponentDecorator(node)
      ? ts.visitEachChild(node, visitComponentMetadata, context)
      : ts.visitEachChild(node, visitDecorators, context);

  // Either custom file transformer or identity transform
  const transformFile: ts.Transformer<ts.SourceFile> = transformer.file ? transformer.file : file => file;

  return transformFile(ts.visitNode(sourceFile, visitDecorators));
};
