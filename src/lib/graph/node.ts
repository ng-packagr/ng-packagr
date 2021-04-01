export type NodeState = '' | 'dirty' | 'in-progress' | 'pending' | 'done';

export const STATE_DIRTY: NodeState = 'dirty';
export const STATE_IN_PROGRESS: NodeState = 'in-progress';
export const STATE_PENDING: NodeState = 'pending';
export const STATE_DONE: NodeState = 'done';

/**
 * A Node in the {@link BuildGraph}.
 */
export class Node {
  constructor(public readonly url: string) { }

  public type: string;

  public data: any;

  public state: NodeState = '';

  public filter(by: (value: Node, index: number) => boolean): Node[] {
    return [...this._dependents.values()].filter(by);
  }

  public find(by: (value: Node, index: number) => boolean): Node | undefined {
    return [...this._dependents.values()].find(by);
  }

  public some(by: (value: Node, index: number) => boolean): boolean {
    return [...this._dependents.values()].some(by);
  }

  public get dependents(): Map<string, Node> {
    return this._dependents;
  }

  public get dependees(): Map<string, Node> {
    return this._dependees;
  }

  private _dependents = new Map<string, Node>();
  private _dependees = new Map<string, Node>();

  /** @experimental DO NOT USE. For time being, dirty checking is for `type=entryPoint && state !== 'done'` (full rebuild of entry point). */
  public dependsOn(dependent: Node | Node[]) {
    const newDeps = dependent instanceof Array ? dependent : [dependent];

    for (const newDep of newDeps) {
      if (newDep._dependees.has(this.url)) {
        // nodes already depends on each other
        continue;
      }

      newDep._dependees.set(this.url, this);
      this._dependents.set(newDep.url, newDep);
    }
  }
}
