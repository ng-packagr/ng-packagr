import * as ts from 'typescript';
import { ensureUnixPath } from '../util/path';

export interface CacheEntry {
  exists?: boolean;
  sourceFile?: ts.SourceFile;
  content?: string;
}

export const enum DeleteStrategy {
  FullMatch = 0,
  PartialMatch = 1
}

export class FileCache {
  private cache: Map<string, CacheEntry> = new Map();

  forEach: (
    callbackfn: (value: CacheEntry, key: string, map: Map<string, CacheEntry>) => void,
    thisArg?: any
  ) => void = this.cache.forEach.bind(this.cache);
  clear: () => void = this.cache.clear.bind(this.cache);

  size(): number {
    return this.cache.size;
  }

  normalizeKey(fileName: string): string {
    return ensureUnixPath(fileName);
  }

  delete(fileName: string, deleteStrategy: DeleteStrategy = DeleteStrategy.FullMatch): boolean {
    const normalizedKey = this.normalizeKey(fileName);
    if (deleteStrategy === DeleteStrategy.FullMatch) {
      return this.cache.delete(this.normalizeKey(fileName));
    }

    let deleted: boolean;
    this.cache.forEach((_value, key) => {
      const normalizedFileKey = this.normalizeKey(key);
      if (normalizedFileKey.startsWith(normalizedKey)) {
        deleted = this.cache.delete(normalizedFileKey) || deleted;
      }
    });

    return deleted;
  }

  has(fileName: string): boolean {
    return this.cache.has(this.normalizeKey(fileName));
  }

  getOrCreate(fileName: string): CacheEntry {
    const normalizedKey = this.normalizeKey(fileName);
    let entry = this.cache.get(normalizedKey);

    if (!entry) {
      entry = {};
      this.cache.set(normalizedKey, entry);
    }

    return entry;
  }
}
