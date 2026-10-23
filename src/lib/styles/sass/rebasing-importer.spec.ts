import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { RelativeUrlRebasingImporter } from './rebasing-importer';

describe('RelativeUrlRebasingImporter', () => {
  let root: string;

  beforeAll(async () => {
    root = await mkdtemp(join(tmpdir(), 'ng-packagr-rebasing-importer-'));
    await mkdir(join(root, 'theme'));
  });

  afterAll(async () => {
    await rm(root, { recursive: true, force: true });
  });

  async function load(contents: string): Promise<string> {
    const file = join(root, 'theme', '_partial.scss');
    await writeFile(file, contents);

    const result = new RelativeUrlRebasingImporter(root).load(pathToFileURL(file));

    return result?.contents as string;
  }

  it('should rebase every url in a stylesheet', async () => {
    const contents = await load(`.a { background: url('./a.svg'); }\n.b { background: url('./b.svg'); }`);

    expect(contents).toBe(
      `.a { background: url("theme||file:./a.svg"); }\n.b { background: url("theme||file:./b.svg"); }`,
    );
  });

  it('should rebase a url with a hyphen-namespaced Sass variable', async () => {
    const contents = await load(`@use './vars' as named-hyphen;\n.a { background: url(named-hyphen.$icon); }`);

    expect(contents).toContain('url("theme||file:#{named-hyphen.$icon}")');
  });
});
