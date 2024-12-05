import { Diagnostic, SourceFile } from 'typescript';

export class AngularDiagnosticsCache {
  #cache: Map<string, ReadonlyArray<Diagnostic>> = new Map();

  update(sourceFile: SourceFile, diagnostics: ReadonlyArray<Diagnostic>): void {
    this.#cache.set(sourceFile.fileName, diagnostics);
  }

  get(sourceFile: SourceFile): ReadonlyArray<Diagnostic> {
    return this.#cache.get(sourceFile.fileName) ?? [];
  }
}
