export type NodeState = '' | 'dirty' | 'in-progress' | 'pending' | 'done';

export const STATE_DIRTY: NodeState = 'dirty';
export const STATE_IN_PROGRESS: NodeState = 'in-progress';
export const STATE_PENDING: NodeState = 'pending';
export const STATE_DONE: NodeState = 'done';

/**
 * A Node in the {@link BuildGraph}.
 */
export class Node {
  constructor(public readonly url: string) {}

  public type: string;

  public data: any;

  public state: NodeState = '';

  public filter(by: (value: Node, index: number) => boolean): Node[] {
    return [...this._dependents].filter(by);
  }

  public find(by: (value: Node, index: number) => boolean): Node | undefined {
    return [...this._dependents].find(by);
  }

  public some(by: (value: Node, index: number) => boolean): boolean {
    return [...this._dependents].some(by);
  }

  public get dependents(): Set<Node> {
    return this._dependents;
  }

  public get dependees(): Set<Node> {
    return this._dependees;
  }

  private _dependents = new Set<Node>();
  private _dependees = new Set<Node>();

  public dependsOn(dependent: Node | Node[]) {
    const newDeps = Array.isArray(dependent) ? dependent : [dependent];

    for (const newDep of newDeps) {
      if (newDep._dependees.has(this)) {
        // nodes already depends on each other
        continue;
      }

      newDep._dependees.add(this);
      this._dependents.add(newDep);
    }
  }
}
