import * as ts from 'typescript';
import * as path from 'path';
import { isComponentDecorator, isTemplateUrl, isStyleUrls } from './ng-type-guards';
import { transformComponent } from './transform-component';

export type StylesheetProcessor = (
  sourceFile: string,
  styleUrl: string,
  styleFilePath: string
) => string | undefined | void;

export type TemplateProcessor = (
  sourceFile: string,
  templateUrl: string,
  templateFilePath: string
) => string | undefined | void;

export type SourceFileWriter = (sourceFile: ts.SourceFile, node: ts.Node, sourceText: string) => void;

export type ComponentTransformer = (
  {

  }: {
    templateProcessor: TemplateProcessor;
    stylesheetProcessor: StylesheetProcessor;
    sourceFileWriter?: any;
  }
) => ts.TransformerFactory<ts.SourceFile>;

export const componentTransformer: ComponentTransformer = ({
  templateProcessor,
  stylesheetProcessor,
  sourceFileWriter
}) =>
  transformComponent({
    templateVisitor: node => {
      const sourceFile = node.getSourceFile();
      const sourceFilePath = node.getSourceFile().fileName;

      // XX: strip quotes (' or ") from path
      const templatePath = node.initializer.getText().substring(1, node.initializer.getText().length - 1);
      const templateFilePath = path.resolve(path.dirname(sourceFilePath), templatePath);
      const template = templateProcessor(sourceFilePath, templatePath, templateFilePath);

      if (typeof template === 'string') {
        const synthesizedNode = ts.updatePropertyAssignment(
          node,
          ts.createIdentifier('template'),
          ts.createLiteral(template)
        );

        if (sourceFileWriter) {
          const synthesizedSourceText = 'template: `'.concat(template).concat('`');
          sourceFileWriter(sourceFile, node, synthesizedSourceText);
        }

        return synthesizedNode;
      } else {
        return node;
      }
    },
    stylesheetVisitor: node => {
      const sourceFile = node.getSourceFile();
      const sourceFilePath = node.getSourceFile().fileName;

      // handle array arguments for styleUrls
      const styleUrls = node.initializer
        .getChildren()
        .filter(node => node.kind === ts.SyntaxKind.SyntaxList)
        .map(node => node.getChildren().map(n => n.getText()))
        .reduce((prev, current) => prev.concat(...current), [])
        .filter(text => text !== ',')
        .map(url => url.substring(1, url.length - 1));

      const stylesheets = styleUrls.map((url: string) => {
        const styleFilePath = path.resolve(path.dirname(sourceFilePath), url);
        const content = stylesheetProcessor(sourceFilePath, url, styleFilePath);

        return typeof content === 'string' ? content : url;
      });

      const hasChanged = stylesheets.every((value, index) => {
        return styleUrls[index] && styleUrls[index] !== value;
      });

      if (hasChanged) {
        const synthesizedNode = ts.updatePropertyAssignment(
          node,
          ts.createIdentifier('styles'),
          ts.createArrayLiteral(stylesheets.map(value => ts.createLiteral(value)))
        );

        if (sourceFileWriter) {
          const synthesizedSourceText = 'styles: ['
            .concat(stylesheets.map(value => `\`${value}\``).join(', '))
            .concat(']');
          sourceFileWriter(sourceFile, node, synthesizedSourceText);
        }

        return synthesizedNode;
      } else {
        return node;
      }
    }
  });
