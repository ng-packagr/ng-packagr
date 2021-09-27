import * as cacache from 'cacache';
import { readFile } from '../utils/fs';
import { createHash } from 'crypto';

let ngPackagrVersion: string | undefined;
try {
  ngPackagrVersion = require('../../package.json').version;
} catch {
  // dev path
  ngPackagrVersion = require('../../../package.json').version;
}

export function generateKey(...valuesToConsider: string[]): string {
  return createHash('sha1').update(ngPackagrVersion).update(valuesToConsider.join(':')).digest('hex');
}

export async function readCacheEntry(cachePath: string, key: string): Promise<any | undefined> {
  const entry = await cacache.get.info(cachePath, key);
  if (entry) {
    return JSON.parse(await readFile(entry.path, 'utf8'));
  }

  return undefined;
}

export async function saveCacheEntry(cachePath: string, key: string, content: string): Promise<void> {
  await cacache.put(cachePath, key, content);
}
