import * as ts from 'typescript';
import * as path from 'path';
import { isComponentDecorator, isTemplateUrl, isStyleUrls } from './ng-type-guards';
import { transformComponent } from './transform-component';
import { isSynthesizedSourceFile, replaceWithSynthesizedSourceText, writeSourceFile } from './synthesized-source-file';

/**
 * Call signature for a transformer applied to `@Component({ templateUrl: '...' })`.
 *
 * A `TemplateTransformer` will update the property assignment for `templateUrl` in the decorator.
 */
export interface TemplateTransformer {
  (
    {

    }: {
      node: ts.Node;
      sourceFile: ts.SourceFile;
      sourceFilePath: string;
      templatePath: string;
      templateFilePath: string;
    }
  ): string | undefined | void;
}

/**
 * Call signature for a transformer applied to `@Component({ styleUrls: ['...'] })`.
 *
 * A `StylesheetTransformer` will update the property assignment for `stylesUrl` in the decorator.
 *
 * WATCH OUT! A stylesheet transformer is called for every url in the `stylesUrl` array!
 */
export interface StylesheetTransformer {
  (
    {

    }: {
      node: ts.Node;
      sourceFile: ts.SourceFile;
      sourceFilePath: string;
      stylePath: string;
      styleFilePath: string;
    }
  ): string | undefined | void;
}

export interface ComponentTransformer {
  (
    {

    }: {
      template: TemplateTransformer;
      stylesheet: StylesheetTransformer;
    }
  ): ts.TransformerFactory<ts.SourceFile>;
}

export const transformComponentSourceFiles: ComponentTransformer = ({ template, stylesheet }) =>
  transformComponent({
    templateUrl: node => {
      const sourceFile = node.getSourceFile();
      const sourceFilePath = node.getSourceFile().fileName;
      // XX: strip quotes (' or ") from path
      const templatePath = node.initializer.getText().substring(1, node.initializer.getText().length - 1);
      const templateFilePath = path.resolve(path.dirname(sourceFilePath), templatePath);

      // Call the transformer
      const inlinedTemplate = template({ node, sourceFile, sourceFilePath, templatePath, templateFilePath });

      if (typeof inlinedTemplate === 'string') {
        // Apply the transformer result, thus altering the source file
        const synthesizedNode = ts.updatePropertyAssignment(
          node,
          ts.createIdentifier('template'),
          ts.createLiteral(inlinedTemplate)
        );

        const synthesizedSourceText = 'template: `'.concat(inlinedTemplate).concat('`');
        replaceWithSynthesizedSourceText(node, synthesizedSourceText);

        return synthesizedNode;
      } else {
        return node;
      }
    },
    styleUrls: node => {
      const sourceFile = node.getSourceFile();
      const sourceFilePath = node.getSourceFile().fileName;

      // Handle array arguments for styleUrls
      const styleUrls = node.initializer
        .getChildren()
        .filter(node => node.kind === ts.SyntaxKind.SyntaxList)
        .map(node => node.getChildren().map(n => n.getText()))
        .reduce((prev, current) => prev.concat(...current), [])
        .filter(text => text !== ',')
        .map(url => url.substring(1, url.length - 1));

      // Call the transformation for each value found in `stylesUrls: []`.
      const stylesheets = styleUrls.map((url: string) => {
        const styleFilePath = path.resolve(path.dirname(sourceFilePath), url);

        // Call the stylesheet transformer
        const content = stylesheet({ node, sourceFile, sourceFilePath, stylePath: url, styleFilePath });

        return typeof content === 'string' ? content : url;
      });

      // Check if the transformer manipulated the metadata of the `@Component({..})` decorator
      const hasChanged = stylesheets.every((value, index) => {
        return styleUrls[index] && styleUrls[index] !== value;
      });

      if (hasChanged) {
        // Apply the transformation result, thus altering the source file
        const synthesizedNode = ts.updatePropertyAssignment(
          node,
          ts.createIdentifier('styles'),
          ts.createArrayLiteral(stylesheets.map(value => ts.createLiteral(value)))
        );

        const synthesizedSourceText = 'styles: ['
          .concat(stylesheets.map(value => `\`${value}\``).join(', '))
          .concat(']');
        replaceWithSynthesizedSourceText(node, synthesizedSourceText);

        return synthesizedNode;
      } else {
        return node;
      }
    },
    file: sourceFile => {
      // XX ... the string replacement is quite hacky.
      // Why can't we use `ts.SourceFile#update()`?
      // It produces a `FalseExpression` error, somehow.
      if (isSynthesizedSourceFile(sourceFile['original'])) {
        sourceFile['__replacements'] = sourceFile['original'].__replacements;
        return writeSourceFile(sourceFile);
      }

      return sourceFile;
    }
  });
