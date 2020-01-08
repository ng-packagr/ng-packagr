import * as ts from 'typescript';
import { ParsedConfiguration, Program } from '@angular/compiler-cli';
import { Node } from '../graph/node';
import { by, isInProgress, isDirty } from '../graph/select';
import { NgEntryPoint, DestinationFiles } from './entry-point/entry-point';
import { NgPackage } from './package';
import { FileCache } from '../file-system/file-cache';

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

export function byEntryPoint() {
  return by(isEntryPoint);
}

export function isEntryPointInProgress() {
  return by(isEntryPoint).and(isInProgress);
}

export function isEntryPointDirty() {
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

  constructor(public readonly url: string, readonly sourcesFileCache?: FileCache) {
    super(url);

    if (sourcesFileCache) {
      this.cache.sourcesFileCache = sourcesFileCache;
    }
  }

  cache: {
    oldPrograms?: Record<ts.ScriptTarget, Program>;
    sourcesFileCache: FileCache;
    moduleResolutionCache: ts.ModuleResolutionCache;
  } = {
    sourcesFileCache: new FileCache(),
    moduleResolutionCache: ts.createModuleResolutionCache(process.cwd(), s => s),
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
    globCache: {} as Record<string, boolean | 'DIR' | 'FILE' | string[]>,
    sourcesFileCache: new FileCache(),
  };
}
