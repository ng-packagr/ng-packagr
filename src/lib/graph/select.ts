import { Node, STATE_DIRTY, STATE_DONE, STATE_IN_PROGRESS, STATE_PENDING } from './node';

export function and(...criteria: ((node: Node) => boolean)[]) {
  return (node: Node) => criteria.every(c => c(node));
}

export function by(
  criteria: (node: Node) => boolean,
): {
  (node: Node): boolean;
  and: (criteria: (node: Node) => boolean) => (node: Node) => boolean;
} {
  function fn(args) {
    return criteria(args);
  }
  fn['and'] = function (args) {
    return and(criteria, args);
  };

  return fn as any;
}

export function isInProgress(node: Node): boolean {
  return node.state === STATE_IN_PROGRESS;
}

export function isPending(node: Node): boolean {
  return node.state === STATE_PENDING;
}

export function isDirty(node: Node): boolean {
  return node.state === STATE_DIRTY;
}

export function isDone(node: Node): boolean {
  return node.state === STATE_DONE;
}
