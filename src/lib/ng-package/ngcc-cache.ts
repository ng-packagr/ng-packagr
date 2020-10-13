/**
 * Registers the absolute specifiers of libraries that have been processed by ngcc. This cache is
 * reused across all entry-points of a package, so module requests across the entry-points can
 * determine whether invoking ngcc is necessary.
 *
 * The cost of invoking ngcc for an entry-point that has already been processed is limited due to
 * a fast path in ngcc, however even in this fast-path does ngcc scan the entry-point to determine
 * if all dependencies have been processed. This cache allows to avoid that work, as entry-points
 * are processed in batches during which the `node_modules` directory is not mutated.
 */
export class NgccProcessingCache {
  private readonly processedModuleNames = new Set<string>();

  hasProcessed(moduleName: string): boolean {
    return this.processedModuleNames.has(moduleName);
  }

  markProcessed(moduleName: string): void {
    this.processedModuleNames.add(moduleName);
  }

  clear(): void {
    this.processedModuleNames.clear();
  }
}
