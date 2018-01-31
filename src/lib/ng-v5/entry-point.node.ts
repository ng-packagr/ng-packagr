import { Node } from '../brocc/node';

export const TYPE_ENTRY_POINT = 'application/ng-entry-point';

export function and(...criteria: ((node: Node) => boolean)[]) {
  return (node: Node) => criteria.every(c => c(node));
}

export function isEntryPoint(node: Node): boolean {
  return node.type === TYPE_ENTRY_POINT;
}

export function isInProgress(node: Node): boolean {
  return node.state === 'in-progress';
}

export function by(
  criteria: (node: Node) => boolean
): {
  (node: Node): boolean;
  and: (criteria: (node: Node) => boolean) => (node: Node) => boolean;
} {
  function fn(args) {
    return criteria(args);
  }
  fn['and'] = function(args) {
    return and(criteria, args);
  };

  return fn as any;
}

export function byEntryPoint() {
  return by(isEntryPoint);
}

// TODO
export class EntryPointNode extends Node {}
