interface ASTNode {
  type: string;
  range: [number, number];
  loc: { start: { line: number }; end: { line: number } };
  body?: ASTNode[];
  consequent?: ASTNode[];
  parent?: ASTNode;
}

interface Fixer {
  insertTextBefore(node: ASTNode, text: string): unknown;
  insertTextBeforeRange(range: [number, number], text: string): unknown;
}

interface RuleContext {
  sourceCode: {
    getTokenBefore(node: ASTNode): ASTNode | null;
  };
  report(descriptor: { node: ASTNode; message: string; fix?: (fixer: Fixer) => unknown }): void;
}

function isFirstStatementInBlock(node: ASTNode): boolean {
  const parent = node.parent;
  if (!parent) {
    return false;
  }

  // BlockStatement, Program, etc.
  if (Array.isArray(parent.body) && parent.body[0] === node) {
    return true;
  }

  // SwitchCase uses `consequent` instead of `body`
  if (parent.type === 'SwitchCase' && Array.isArray(parent.consequent) && parent.consequent[0] === node) {
    return true;
  }

  return false;
}

const rule = {
  meta: {
    fixable: 'whitespace',
  },
  create(context: RuleContext) {
    return {
      ReturnStatement(node: ASTNode) {
        // Skip if the return is the first (or only) statement in a block
        if (isFirstStatementInBlock(node)) {
          return;
        }

        const tokenBefore = context.sourceCode.getTokenBefore(node);
        if (tokenBefore) {
          const linesBetween = node.loc.start.line - tokenBefore.loc.end.line;
          if (linesBetween < 2) {
            context.report({
              node,
              message: 'Expected blank line before return statement.',
              fix(fixer) {
                const indent = ' '.repeat(node.loc.start.column);

                return fixer.insertTextBefore(node, '\n' + indent);
              },
            });
          }
        }
      },
    };
  },
};

export default {
  meta: { name: 'padding' },
  rules: { 'line-before-return': rule },
};
