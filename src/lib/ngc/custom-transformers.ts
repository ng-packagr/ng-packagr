import { CompilerOptions } from '@angular/compiler-cli';
import * as log from '../utils/log';
import * as ts from 'typescript';

type TTypescriptPlugin = (
  program: ts.Program,
  options?: { [key: string]: unknown },
) => ts.TransformerFactory<ts.SourceFile>;

interface TransformerPluginConfig {
  /**
   * Path to transformer or transformer module name.
   */
  transform: string;

  [key: string]: unknown;
}

function filterPluginConfigs(p: unknown): p is TransformerPluginConfig {
  return typeof p === 'object' && p != null && 'transform' in p && typeof p['transform'] === 'string';
}

function getCustomTransformersConfig(cfg: CompilerOptions): Array<TransformerPluginConfig> {
  if (!('plugins' in cfg) || cfg.plugins == null) {
    return [];
  }
  const plugins = cfg.plugins;
  if (!Array.isArray(plugins)) {
    log.warn(`Expected 'plugins' in compilerOptions to be an array but was ${typeof plugins}.`);
    return [];
  }
  return (plugins as unknown[]).filter(filterPluginConfigs);
}

function extractPlugin(cfg: TransformerPluginConfig): TTypescriptPlugin | null {
  const plugin: unknown = require(cfg.transform);
  if (typeof plugin === 'object' && 'default' in plugin && typeof plugin['default'] === 'function') {
    return plugin['default'];
  }
  log.warn(`Cannot resolve plugin ${cfg.transform}. Plugin will not be applied.`);
  return null;
}

function extractCleanConfig(cfg: TransformerPluginConfig): { [key: string]: unknown } {
  // Config extraction is done this way to maximize compatibility with ttypescript.
  // See: https://github.com/cevek/ttypescript/blob/1.5.9/packages/ttypescript/src/PluginCreator.ts
  const { transform, after, afterDeclarations, name, type, ...cleanConfig } = cfg;
  return cleanConfig;
}

export function loadCustomTransformers(
  getProgram: () => ts.Program,
  compilerOptions: CompilerOptions,
): Array<ts.TransformerFactory<ts.SourceFile>> {
  return getCustomTransformersConfig(compilerOptions)
    .map(cfg => {
      const resolved = extractPlugin(cfg);
      if (resolved == null) {
        return null;
      }

      log.debug(`Using custom transform: ${cfg.transform}`);
      const cleanConfig = extractCleanConfig(cfg);
      return (context: ts.TransformationContext) => {
        return resolved(getProgram(), cleanConfig)(context);
      };
    })
    .filter(transform => transform != null);
}
