let NODE_COUNT = 0;

export type NodeState = '' | 'dirty' | 'in-progress' | 'pending' | 'done';

/**
 * A Node in the {@link BuildGraph}.
 */
export class Node {
  private readonly count: number;

  constructor(public readonly url: string) {
    this.count = NODE_COUNT++;
  }

  public type: string;

  public data: any;

  public state: NodeState = '';

  public filter(by: (value: Node, index: number) => boolean): Node[] {
    return this._dependents.filter(by);
  }

  public find(by: (value: Node, index: number) => boolean): Node | undefined {
    return this._dependents.find(by);
  }

  public get dependents(): Node[] {
    return this._dependents;
  }

  private _dependents: Node[] = [];
  private _dependees: Node[] = [];

  /** @experimental DO NOT USE. For time being, dirty checking is for `type=entryPoint && state !== 'done'` (full rebuild of entry point). */
  public addDependent(dependent: Node | Node[]) {
    const newDeps = dependent instanceof Array ? dependent : [dependent];

    newDeps.forEach(dep => {
      dep._dependees = dep._dependees.filter(d => d !== this).concat(this);
    });

    this._dependents = this._dependents
      .filter(existing => {
        return newDeps.some(newDep => newDep !== existing);
      })
      .concat(newDeps);
  }
}
