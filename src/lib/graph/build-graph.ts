import { Node } from './node';

export interface Traversable<T> {
  filter(by: (value: T, index: number) => boolean): T[];
  find(by: (value: T, index: number) => boolean): T | undefined;
  some(by: (value: T, index: number) => boolean): boolean;
}

/**
 * A tree of source files. Eventually, it's a graph. Ideally, it's an acyclic directed graph.
 * Technically, it's implemented as a map-like collection with references between map entries.
 */
export class BuildGraph implements Traversable<Node> {
  private store = new Map<string, Node>();

  public put(value: Node | Node[]) {
    if (value instanceof Array) {
      value.forEach(node => this.insert(node));
    } else {
      this.insert(value);
    }

    return this;
  }

  private insert(node: Node) {
    if (this.store.has(node.url)) {
      // Clean up dependee references
      const oldNode = this.store.get(node.url);
      oldNode['_dependees'] = oldNode['_dependees'].filter(node => node !== oldNode);
    }

    this.store.set(node.url, node);
  }

  public get(url: string): Node {
    return this.store.get(url);
  }

  public has(url: string): boolean {
    return this.store.has(url);
  }

  public entries(): Node[] {
    const values = this.store.values();

    return Array.from(values);
  }

  public some(by: (value: Node, index: number) => boolean): boolean {
    return this.entries().some(by);
  }

  public filter(by: (value: Node, index: number) => boolean): Node[] {
    return this.entries().filter(by);
  }

  public find(by: (value: Node, index: number) => boolean): Node | undefined {
    return this.entries().find(by);
  }

  public from(node: Node): Traversable<Node> {
    return node;
  }

  get size(): number {
    return this.store.size;
  }
}
