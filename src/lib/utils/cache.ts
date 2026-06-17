import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { debug } from './log';

let ngPackagrVersion: string | undefined;
try {
  ngPackagrVersion = require('../../package.json').version;
} catch {
  // dev path
  ngPackagrVersion = require('../../../package.json').version;
}

const BIGINT_STRING_VALUE_REGEXP = /^%BigInt\((\d+)\)$/;

export async function generateKey(...valuesToConsider: string[]): Promise<string> {
  return createHash('sha256').update(ngPackagrVersion).update(valuesToConsider.join(':')).digest('hex');
}

async function ensureCacheDirExists(cachePath: string): Promise<void> {
  try {
    await mkdir(cachePath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
}

export async function readCacheEntry(cachePath: string, key: string): Promise<any> {
  try {
    const data = await readFile(getCacheFilePath(cachePath, key), 'utf8');

    return JSON.parse(data, (_key, value) => {
      if (typeof value === 'string' && value[0] === '%') {
        const numPart = value.match(BIGINT_STRING_VALUE_REGEXP);
        if (numPart && isFinite(numPart[1] as any)) {
          return BigInt(numPart[1]);
        }
      }

      return value;
    });
  } catch (err) {
    debug(`[readCacheError]: ${err}`);

    return undefined;
  }
}

export async function saveCacheEntry(cachePath: string, key: string, content: any): Promise<void> {
  // Ensure the cache directory exists
  await ensureCacheDirExists(cachePath);

  const data = JSON.stringify(content, (_key, value) => (typeof value === 'bigint' ? `%BigInt(${value})` : value));

  return writeFile(getCacheFilePath(cachePath, key), data, 'utf8');
}

function getCacheFilePath(cachePath: string, key: string): string {
  return join(cachePath, `${key}.json`);
}
