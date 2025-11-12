import type { NgtscProgram, ParsedConfiguration, Program } from '@angular/compiler-cli';
import type { RollupCache } from 'rollup';
import ts from 'typescript';
import { FileCache } from '../file-system/file-cache';
import { ComplexPredicate } from '../graph/build-graph';
import { Node } from '../graph/node';
import { by, isInProgress, isPending } from '../graph/select';
import { AngularDiagnosticsCache } from '../ngc/angular-diagnostics-cache';
import { StylesheetProcessor } from '../styles/stylesheet-processor';
import { DestinationFiles, NgEntryPoint } from './entry-point/entry-point';
import { NgPackage } from './package';

const TYPE_NG_PACKAGE = 'application/ng-package';
const TYPE_NG_ENTRY_POINT = 'application/ng-entry-point';

/** A node that can be read through the `fs` api. */
const URL_PROTOCOL_FILE = 'file://';

/** A node specific to angular. */
const URL_PROTOCOL_NG = 'ng://';

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
  return by(n => isEntryPoint(n) && isInProgress(n));
}

export function isEntryPointPending(): ComplexPredicate<EntryPointNode> {
  return by(n => isEntryPoint(n) && isPending(n));
}

export function fileUrl(path: string): string {
  return `${URL_PROTOCOL_FILE}${path}`;
}

export function fileUrlPath(url: string): string | null {
  return url.startsWith(URL_PROTOCOL_FILE) ? url.slice(URL_PROTOCOL_FILE.length) : null;
}

export function ngUrl(path: string): string {
  return `${URL_PROTOCOL_NG}${path}`;
}

export type OutputFileCache = Map<string, { version?: string; content: string }>;

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
      angularDiagnosticCache: new AngularDiagnosticsCache(),
    };
  }

  cache: {
    outputCache: OutputFileCache;
    oldPrograms?: Record<ts.ScriptTarget | 'analysis', Program | ts.Program>;
    sourcesFileCache: FileCache;
    analysesSourcesFileCache: FileCache;
    moduleResolutionCache: ts.ModuleResolutionCache;
    rollupFESM2022Cache?: RollupCache;
    rollupTypesCache?: RollupCache;
    stylesheetProcessor?: StylesheetProcessor;
    oldNgtscProgram?: NgtscProgram;
    oldBuilder?: ts.EmitAndSemanticDiagnosticsBuilderProgram;
    angularDiagnosticCache: AngularDiagnosticsCache;
  };

  data: {
    destinationFiles: DestinationFiles;
    entryPoint: NgEntryPoint;
    tsConfig?: ParsedConfiguration;
  };

  dispose(): void {
    this.cache.stylesheetProcessor?.destroy();
    this.cache = undefined;
  }
}

export class PackageNode extends Node {
  readonly type = TYPE_NG_PACKAGE;
  data: NgPackage;

  cache = {
    sourcesFileCache: new FileCache(),
    moduleResolutionCache: ts.createModuleResolutionCache(process.cwd(), s => s),
  };
}
