import * as ts from 'typescript';
import { RollupCache } from 'rollup';
import { ParsedConfiguration, Program } from '@angular/compiler-cli';
import { Node } from '../graph/node';
import { by, isInProgress, isDirty } from '../graph/select';
import { NgEntryPoint, DestinationFiles } from './entry-point/entry-point';
import { NgccProcessingCache } from './ngcc-cache';
import { NgPackage } from './package';
import { FileCache } from '../file-system/file-cache';
import { ComplexPredicate } from '../graph/build-graph';
import { StylesheetProcessor } from '../styles/stylesheet-processor';

export const TYPE_NG_PACKAGE = 'application/ng-package';
export const TYPE_NG_ENTRY_POINT = 'application/ng-entry-point';

export type GlobCache = Record<string, boolean | 'DIR' | 'FILE' | string[]>;

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

export class EntryPointNode extends Node {
  readonly type = TYPE_NG_ENTRY_POINT;

  constructor(
    public readonly url: string,
    sourcesFileCache: FileCache,
    ngccProcessingCache: NgccProcessingCache,
    moduleResolutionCache: ts.ModuleResolutionCache,
  ) {
    super(url);

    this.cache = {
      sourcesFileCache,
      ngccProcessingCache,
      analysesSourcesFileCache: new FileCache(),
      moduleResolutionCache,
    };
  }

  cache: {
    oldPrograms?: Record<ts.ScriptTarget | 'analysis', Program | ts.Program>;
    sourcesFileCache: FileCache;
    ngccProcessingCache: NgccProcessingCache;
    analysesSourcesFileCache: FileCache;
    moduleResolutionCache: ts.ModuleResolutionCache;
    rollupFESMCache?: RollupCache;
    rollupUMDCache?: RollupCache;
    stylesheetProcessor?: StylesheetProcessor;
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
    globCache: {} as GlobCache,
    sourcesFileCache: new FileCache(),
    ngccProcessingCache: new NgccProcessingCache(),
    moduleResolutionCache: ts.createModuleResolutionCache(process.cwd(), s => s),
  };
}
