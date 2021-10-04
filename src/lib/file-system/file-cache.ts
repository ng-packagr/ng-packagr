import ts from 'typescript';
import { ensureUnixPath } from '../utils/path';

export interface CacheEntry {
  exists?: boolean;
  sourceFile?: ts.SourceFile;
  content?: string;
  declarationFileName?: string;
  angularDiagnostics?: ts.Diagnostic[];
}

export class FileCache {
  private cache: Map<string, CacheEntry> = new Map();

  forEach: (callbackfn: (value: CacheEntry, key: string, map: Map<string, CacheEntry>) => void, thisArg?: any) => void =
    this.cache.forEach.bind(this.cache);
  clear: () => void = this.cache.clear.bind(this.cache);

  size(): number {
    return this.cache.size;
  }

  normalizeKey(fileName: string): string {
    return ensureUnixPath(fileName);
  }

  delete(fileName: string): boolean {
    return this.cache.delete(this.normalizeKey(fileName));
  }

  has(fileName: string): boolean {
    return this.cache.has(this.normalizeKey(fileName));
  }

  get(fileName: string): CacheEntry | undefined {
    return this.cache.get(this.normalizeKey(fileName));
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

  updateAngularDiagnostics(sourceFile: ts.SourceFile, diagnostics: ts.Diagnostic[]): void {
    if (this.has(sourceFile.fileName)) {
      this.get(sourceFile.fileName).angularDiagnostics = diagnostics;
    }
  }

  getAngularDiagnostics(sourceFile: ts.SourceFile): ts.Diagnostic[] | undefined {
    return this.get(sourceFile.fileName)?.angularDiagnostics;
  }
}
