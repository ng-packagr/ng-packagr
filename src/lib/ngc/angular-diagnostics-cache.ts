import { Diagnostic, SourceFile } from 'typescript';

export class AngularDiagnosticsCache {
  #cache: Map<string, readonly Diagnostic[]> = new Map();

  delete(fileName: string): void {
    this.#cache.delete(fileName);
  }

  has(sourceFile: SourceFile): boolean {
    return this.#cache.has(sourceFile.fileName);
  }

  update(sourceFile: SourceFile, diagnostics: readonly Diagnostic[]): void {
    this.#cache.set(sourceFile.fileName, diagnostics);
  }

  get(sourceFile: SourceFile): readonly Diagnostic[] {
    return this.#cache.get(sourceFile.fileName) ?? [];
  }
}
