import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { generateKey, readCacheEntry, saveCacheEntry } from './cache';

describe('cache utils', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'ng-packagr-cache-test-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  describe('generateKey', () => {
    it('should generate a consistent sha256 hash for given values', async () => {
      const key1 = await generateKey('foo', 'bar', 'baz');
      const key2 = await generateKey('foo', 'bar', 'baz');
      const key3 = await generateKey('foo', 'bar', 'qux');

      expect(key1).toEqual(key2);
      expect(key1).not.toEqual(key3);
      expect(key1).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe('readCacheEntry and saveCacheEntry', () => {
    it('should save and read a cache entry using native JSON', async () => {
      const key = 'test-key';
      const content = {
        hash: 'abc123',
        files: ['bundle.js', 'bundle.d.ts'],
        count: 42,
        nested: { active: true },
      };

      await saveCacheEntry(tempDir, key, content);
      const retrieved = await readCacheEntry(tempDir, key);

      expect(retrieved).toEqual(content);
    });

    it('should return undefined when cache file does not exist', async () => {
      const retrieved = await readCacheEntry(tempDir, 'non-existent-key');
      expect(retrieved).toBeUndefined();
    });

    it('should automatically create nested cache directories', async () => {
      const nestedCacheDir = join(tempDir, 'nested', 'deep', 'cache');
      const key = 'nested-key';
      const content = { success: true };

      await saveCacheEntry(nestedCacheDir, key, content);
      const retrieved = await readCacheEntry(nestedCacheDir, key);

      expect(retrieved).toEqual(content);
    });
  });
});
