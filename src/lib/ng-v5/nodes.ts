import * as ts from 'typescript';
import { Node } from '../brocc/node';
import { by, isInProgress, isDirty } from '../brocc/select';
import { NgEntryPoint } from '../ng-package-format/entry-point';
import { NgPackage } from '../ng-package-format/package';
import { TsConfig } from '../ts/tsconfig';
import { DestinationFiles } from '../ng-package-format/shared';

export const TYPE_NG_PACKAGE = 'application/ng-package';
export const TYPE_NG_ENTRY_POINT = 'application/ng-entry-point';
export const TYPE_STYLESHEET = 'text/css';
export const TYPE_TEMPLATE = 'text/html';
export const TYPE_TS_SOURCES = 'application/ts';

/** A node that can be read through the `fs` api. */
export const URL_PROTOCOL_FILE = 'file://';

/** A node that can be read through the `ts` compiler api. */
export const URL_PROTOCOL_TS = 'ts://';

/** A node specific to angular. */
export const URL_PROTOCOL_NG = 'ng://';

export function isEntryPoint(node: Node): node is EntryPointNode {
  return node.type === TYPE_NG_ENTRY_POINT;
}

export function isPackage(node: Node): node is PackageNode {
  return node.type === TYPE_NG_PACKAGE;
}

export function isStylesheet(node: Node): node is StylesheetNode {
  return node.type === TYPE_STYLESHEET;
}

export function isTemplate(node: Node): node is TemplateNode {
  return node.type === TYPE_TEMPLATE;
}

export function isTypeScriptSources(node: Node): node is TypeScriptSourceNode {
  return node.type === TYPE_TS_SOURCES;
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

export function isTsUrl(value: string): boolean {
  return value.startsWith(URL_PROTOCOL_TS);
}

export function tsUrl(path: string): string {
  return `${URL_PROTOCOL_TS}${path}`;
}

export class EntryPointNode extends Node {
  public readonly type = TYPE_NG_ENTRY_POINT;

  data: {
    destinationFiles: DestinationFiles;
    entryPoint: NgEntryPoint;
    tsConfig?: TsConfig;
  };
}

export class PackageNode extends Node {
  public readonly type = TYPE_NG_PACKAGE;

  data: NgPackage;
}

export class StylesheetNode extends Node {
  public readonly type = TYPE_STYLESHEET;

  data: { content?: string; source?: string };
}

export class TemplateNode extends Node {
  public readonly type = TYPE_TEMPLATE;

  data: { content?: string };
}

export class TypeScriptSourceNode extends Node {
  public readonly type = TYPE_TS_SOURCES;

  data: ts.TransformationResult<ts.SourceFile>;
}
