import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CssUrl } from './css-url.enum';
import { StylesheetProcessor } from './stylesheet-processor';

describe('StylesheetProcessor', () => {
  let root: string;

  beforeAll(async () => {
    root = await mkdtemp(join(tmpdir(), 'ng-packagr-stylesheet-processor-'));
  });

  afterAll(async () => {
    await rm(root, { recursive: true, force: true });
  });

  async function writePlugin(name: string, source: string): Promise<void> {
    const pluginDirectory = join(root, 'node_modules', name);
    await mkdir(pluginDirectory, { recursive: true });
    await writeFile(join(pluginDirectory, 'package.json'), JSON.stringify({ name, main: 'index.js' }));
    await writeFile(join(pluginDirectory, 'index.js'), source);
  }

  it('should load PostCSS plugins relative to the PostCSS configuration file', async () => {
    await writePlugin(
      'postcss-red-to-blue',
      `module.exports = () => ({
        postcssPlugin: 'red-to-blue',
        Declaration(decl) { if (decl.value === 'red') decl.value = 'blue'; },
      });
      module.exports.postcss = true;`,
    );
    await writePlugin(
      'postcss-esmodule-default',
      `Object.defineProperty(exports, '__esModule', { value: true });
      const plugin = () => ({
        postcssPlugin: 'esmodule-default',
        Declaration(decl) { if (decl.value === 'green') decl.value = 'lime'; },
      });
      plugin.postcss = true;
      exports.default = plugin;`,
    );
    await writeFile(
      join(root, 'postcss.config.json'),
      JSON.stringify({ plugins: { 'postcss-red-to-blue': {}, 'postcss-esmodule-default': {} } }),
    );
    await writeFile(join(root, 'cmp.css'), '.a { color: red; } .b { color: green; }');

    const processor = new StylesheetProcessor(root, root, CssUrl.inline, [], undefined, false, false);
    try {
      const { contents, errors } = await processor.bundleFile(join(root, 'cmp.css'));

      expect(errors).toBeUndefined();
      expect(contents).toContain('.a{color:#00f}');
      expect(contents).toContain('.b{color:#0f0}');
    } finally {
      processor.destroy();
    }
  });
});
