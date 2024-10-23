import { FSWatcher } from 'chokidar';
import { URL_PROTOCOL_FILE } from '../ng-package/nodes';
import { Node } from './node';

export type SimplePredicate<T = Node> = {
  (value: T, index: number): boolean;
  and?: (criteria: SimplePredicate<T>) => SimplePredicate<T>;
};

export type ComplexPredicate<T = Node, R extends T = T> =
  | SimplePredicate<T>
  | {
      (value: T, index: number): value is R;
      and?: (criteria: ComplexPredicate<T, R>) => ComplexPredicate<T, R>;
    };

export interface Traversable<T> {
  filter<R extends T = T>(by: ComplexPredicate<T, R>): R[];
  find<R extends T = T>(by: ComplexPredicate<T, R>): R | undefined;
  some(by: SimplePredicate<T>): boolean;
}

/**
 * A tree of source files. Eventually, it's a graph. Ideally, it's an acyclic directed graph.
 * Technically, it's implemented as a map-like collection with references between map entries.
 */
export class BuildGraph implements Traversable<Node> {
  private store = new Map<string, Node>();
  watcher?: FSWatcher;

  public put(value: Node | Node[]) {
    if (value instanceof Array) {
      for (const node of value) {
        this.insert(node);
      }
    } else {
      this.insert(value);
    }

    return this;
  }

  private insert(node: Node) {
    if (this.store.has(node.url)) {
      // Clean up dependee references
      const oldNode = this.store.get(node.url);
      oldNode['_dependees'].delete(oldNode);
    }

    if (this.watcher && node.url.startsWith(URL_PROTOCOL_FILE)) {
      this.watcher.add(node.url.slice(URL_PROTOCOL_FILE.length));
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

  public values(): IterableIterator<Node> {
    return this.store.values();
  }

  public some<T extends Node = Node>(by: ComplexPredicate<Node, T>): boolean {
    return this.entries().some(by);
  }

  public filter<T extends Node = Node>(by: ComplexPredicate<Node, T>): T[] {
    return this.entries().filter(by) as T[];
  }

  public find<T extends Node = Node>(by: ComplexPredicate<Node, T>): T | undefined {
    return this.entries().find(by) as T | undefined;
  }

  get size(): number {
    return this.store.size;
  }
}
