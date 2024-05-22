import type { NgtscProgram, ParsedConfiguration, Program } from '@angular/compiler-cli';
import type { RollupCache } from 'rollup';
import ts from 'typescript';
import { FileCache } from '../file-system/file-cache';
import { ComplexPredicate } from '../graph/build-graph';
import { Node } from '../graph/node';
import { by, isDirty, isInProgress } from '../graph/select';
import { StylesheetProcessor } from '../styles/stylesheet-processor';
import { DestinationFiles, NgEntryPoint } from './entry-point/entry-point';
import { NgPackage } from './package';

export const TYPE_NG_PACKAGE = 'application/ng-package';
export const TYPE_NG_ENTRY_POINT = 'application/ng-entry-point';

/** A node that can be read through the `fs` api. */
export const URL_PROTOCOL_FILE = 'file://';

/** A node specific to angular. */
export const URL_PROTOCOL_NG = 'ng://';

export function isEntryPoint(node: Node): node is EntryPointNode {
  return node.type === TYPE_NG_ENTRY_POINT;
}

export function isPackage(node: Node): node is PackageNode {
  return node.type === TYPE_NG_PACKAGE;
}

export function byEntryPoint(): ComplexPredicate<EntryPointNode> {
  return by(isEntryPoint);
}

export function isEntryPointInProgress(): ComplexPredicate<EntryPointNode> {
  return by(isEntryPoint).and(isInProgress);
}

export function isEntryPointDirty(): ComplexPredicate<EntryPointNode> {
  return by(isEntryPoint).and(isDirty);
}

export function isFileUrl(value: string): boolean {
  return value.startsWith(URL_PROTOCOL_FILE);
}

export function fileUrl(path: string): string {
  return `${URL_PROTOCOL_FILE}${path}`;
}

export function fileUrlPath(url: string): string {
  if (url.startsWith(URL_PROTOCOL_FILE)) {
    return url.substring(URL_PROTOCOL_FILE.length);
  }
}

export function ngUrl(path: string): string {
  return `${URL_PROTOCOL_NG}${path}`;
}

export type OutputFileCache = Map<string, { version?: string; content: string; map?: any }>;

export class EntryPointNode extends Node {
  readonly type = TYPE_NG_ENTRY_POINT;

  constructor(
    public readonly url: string,
    sourcesFileCache: FileCache,
    moduleResolutionCache: ts.ModuleResolutionCache,
  ) {
    super(url);

    this.cache = {
      sourcesFileCache,
      analysesSourcesFileCache: new FileCache(),
      moduleResolutionCache,
      outputCache: new Map(),
    };
  }

  cache: {
    outputCache: OutputFileCache;
    oldPrograms?: Record<ts.ScriptTarget | 'analysis', Program | ts.Program>;
    sourcesFileCache: FileCache;
    analysesSourcesFileCache: FileCache;
    moduleResolutionCache: ts.ModuleResolutionCache;
    rollupFESM2022Cache?: RollupCache;
    stylesheetProcessor?: StylesheetProcessor;
    oldNgtscProgram?: NgtscProgram;
    oldBuilder?: ts.EmitAndSemanticDiagnosticsBuilderProgram;
  };

  data: {
    destinationFiles: DestinationFiles;
    entryPoint: NgEntryPoint;
    tsConfig?: ParsedConfiguration;
  };
}

export class PackageNode extends Node {
  readonly type = TYPE_NG_PACKAGE;
  data: NgPackage;

  cache = {
    sourcesFileCache: new FileCache(),
    moduleResolutionCache: ts.createModuleResolutionCache(process.cwd(), s => s),
  };
}
