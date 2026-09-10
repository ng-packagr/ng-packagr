import { FSWatcher } from 'chokidar';
import { fileUrlPath } from '../ng-package/nodes';
import { Node } from './node';

export type SimplePredicate<T = Node> = {
  (value: T): boolean;
  and?: (criteria: SimplePredicate<T>) => SimplePredicate<T>;
};

export type ComplexPredicate<T = Node, R extends T = T> =
  | SimplePredicate<T>
  | {
      (value: T): value is R;
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
  readonly store: Map<string, Node>;
  private _watcher?: FSWatcher;

  constructor(store?: Map<string, Node>) {
    this.store = store ?? new Map<string, Node>();
  }

  get watcher(): FSWatcher | undefined {
    return this._watcher;
  }

  set watcher(watcher: FSWatcher | undefined) {
    this._watcher = watcher;
  }

  put(value: Node | Node[]) {
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

    if (this.watcher) {
      const fileUrl = fileUrlPath(node.url);
      if (fileUrl) {
        this.watcher.add(fileUrl);
      }
    }

    this.store.set(node.url, node);
  }

  get(url: string): Node {
    return this.store.get(url);
  }

  has(url: string): boolean {
    return this.store.has(url);
  }

  entries(): Node[] {
    return Array.from(this.store.values());
  }

  values(): IterableIterator<Node> {
    return this.store.values();
  }

  some<T extends Node = Node>(by: ComplexPredicate<Node, T>): boolean {
    for (const node of this.store.values()) {
      if (by(node)) {
        return true;
      }
    }

    return false;
  }

  filter<T extends Node = Node>(by: ComplexPredicate<Node, T>): T[] {
    const result: T[] = [];

    for (const node of this.store.values()) {
      if (by(node)) {
        result.push(node as T);
      }
    }

    return result;
  }

  find<T extends Node = Node>(by: ComplexPredicate<Node, T>): T | undefined {
    for (const node of this.store.values()) {
      if (by(node)) {
        return node as T;
      }
    }

    return undefined;
  }

  get size(): number {
    return this.store.size;
  }
}

export class ScopedBuildGraph<T extends Node = Node> extends BuildGraph {
  constructor(
    readonly parentGraph: BuildGraph,
    readonly activeEntryPoint: T,
  ) {
    super(parentGraph.store);
  }

  override get watcher(): FSWatcher | undefined {
    return this.parentGraph.watcher;
  }

  override set watcher(watcher: FSWatcher | undefined) {
    this.parentGraph.watcher = watcher;
  }
}

export function isScopedBuildGraph<T extends Node = Node>(graph: BuildGraph): graph is ScopedBuildGraph<T> {
  return graph instanceof ScopedBuildGraph;
}
