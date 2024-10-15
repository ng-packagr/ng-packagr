import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { version as tsVersion } from 'typescript';
import { ngCompilerCli } from './load-esm';

let ngPackagrVersion: string | undefined;
try {
  ngPackagrVersion = require('../../package.json').version;
} catch {
  // dev path
  ngPackagrVersion = require('../../../package.json').version;
}

const BIGINT_STRING_VALUE_REGEXP = /^%BigInt\((\d+)\)$/;

let compilerCliVersion: string | undefined;

export async function generateKey(...valuesToConsider: string[]): Promise<string> {
  if (compilerCliVersion === undefined) {
    compilerCliVersion = (await ngCompilerCli()).VERSION.full;
  }

  return createHash('sha256')
    .update(ngPackagrVersion)
    .update(compilerCliVersion)
    .update(tsVersion)
    .update(valuesToConsider.join(':'))
    .digest('hex');
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
  const filePath = join(cachePath, key);

  try {
    const data = await readFile(filePath, 'utf8');

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
    if (err.code === 'ENOENT') {
      // File does not exist (cache miss)
      return undefined;
    }

    throw err;
  }
}

export async function saveCacheEntry(cachePath: string, key: string, content: any): Promise<void> {
  const filePath = join(cachePath, key);

  // Ensure the cache directory exists
  await ensureCacheDirExists(cachePath);

  const data = JSON.stringify(content, (_key, value) => (typeof value === 'bigint' ? `%BigInt(${value})` : value));

  await writeFile(filePath, data, 'utf8');
}
