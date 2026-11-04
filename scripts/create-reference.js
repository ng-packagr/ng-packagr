'use strict';

const fs = require('fs');
const path = require('path');

const LAYOUTS = ['flat', 'deep'];
const STYLES = ['inline', 'inline-scss', 'external'];

function parseArgs(argv) {
  const args = { layout: 'flat', style: 'inline', count: 2000, depth: 11, out: undefined, clean: false };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--layout':
        args.layout = argv[++i];
        break;
      case '--style':
        args.style = argv[++i];
        break;
      case '--count':
        args.count = parseInt(argv[++i], 10);
        break;
      case '--depth':
        args.depth = parseInt(argv[++i], 10);
        break;
      case '--out':
        args.out = argv[++i];
        break;
      case '--clean':
        args.clean = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!LAYOUTS.includes(args.layout)) {
    throw new Error(`--layout must be one of ${LAYOUTS.join(', ')}, got "${args.layout}"`);
  }
  if (!STYLES.includes(args.style)) {
    throw new Error(`--style must be one of ${STYLES.join(', ')}, got "${args.style}"`);
  }
  if (!Number.isInteger(args.count) || args.count < 1) {
    throw new Error(`--count must be a positive integer, got "${args.count}"`);
  }
  if (!Number.isInteger(args.depth) || args.depth < 1) {
    throw new Error(`--depth must be a positive integer, got "${args.depth}"`);
  }
  if (!args.out) {
    args.out = path.join('integration', 'reference', `apf-reference-${args.layout}-${args.style}`);
  }

  return args;
}

function buildComponentSource(className, selector, compBase, id, style) {
  const metadataLines = [`  standalone: true,`, `  selector: '${selector}',`];

  if (style === 'external') {
    metadataLines.push(`  templateUrl: './${compBase}.component.html',`);
    metadataLines.push(`  styleUrls: ['./${compBase}.component.scss'],`);
  } else {
    metadataLines.push(`  template: '<div class="ref-comp">Reference component ${id}</div>',`);
    if (style === 'inline-scss') {
      metadataLines.push(`  styles: ['.ref-comp { display: block; padding: 4px; }'],`);
    }
  }

  return `import { Component } from '@angular/core';

@Component({
${metadataLines.join('\n')}
})
export class ${className} {}
`;
}

// Writes one ng-packagr secondary entry point (ng-package.json + public_api.ts + component)
// directly into `entryDir`. No per-entry package.json is needed: ng-packagr derives the
// secondary entry point's package name from its folder path relative to the project root.
function writeEntryPoint(entryDir, id, style) {
  fs.mkdirSync(entryDir, { recursive: true });

  const className = `RefComponent${id}`;
  const selector = `ref-comp-${id}`;
  const compBase = `comp-${id}`;

  fs.writeFileSync(
    path.join(entryDir, 'ng-package.json'),
    JSON.stringify({ lib: { entryFile: 'public_api.ts' } }, null, 2) + '\n',
  );
  fs.writeFileSync(path.join(entryDir, 'public_api.ts'), `export * from './${compBase}.component';\n`);

  if (style === 'external') {
    fs.writeFileSync(
      path.join(entryDir, `${compBase}.component.html`),
      `<div class="ref-comp">Reference component ${id}</div>\n`,
    );
    fs.writeFileSync(
      path.join(entryDir, `${compBase}.component.scss`),
      `.ref-comp {\n  display: block;\n  padding: 4px;\n}\n`,
    );
  }

  fs.writeFileSync(
    path.join(entryDir, `${compBase}.component.ts`),
    buildComponentSource(className, selector, compBase, id, style),
  );
}

function generateFlat(outDir, count, style) {
  const width = String(count).length;
  for (let i = 1; i <= count; i++) {
    const id = String(i).padStart(width, '0');
    writeEntryPoint(path.join(outDir, `comp-${id}`), id, style);
  }
  console.log(`Generated ${count} secondary entry points under ${outDir}`);
}

// Builds a binary tree `depth` levels deep, reusing the same two child names ("sub-a"/"sub-b")
// at every level, and places one secondary entry point directly at each of the 2^depth leaves.
// ng-packagr discovers entry points by globbing **/ng-package.json (see
// src/lib/ng-package/discover-packages.ts), so nesting depth alone is enough to exercise it --
// no barrel/re-export files are needed along the way.
function generateDeep(outDir, depth, style) {
  const total = 2 ** depth;
  const width = String(total).length;
  let counter = 0;

  function build(currentDir, level) {
    if (level === depth) {
      counter++;
      const id = String(counter).padStart(width, '0');
      writeEntryPoint(currentDir, id, style);
      return;
    }
    for (const child of ['sub-a', 'sub-b']) {
      build(path.join(currentDir, child), level + 1);
    }
  }

  build(outDir, 0);
  console.log(`Generated ${counter} secondary entry points (2^${depth}) under ${outDir}`);
}

function writeFixtureRoot(outDir, label) {
  fs.mkdirSync(outDir, { recursive: true });

  const packageJson = {
    name: `@reference/${label}`,
    version: '1.0.0-pre.0',
    private: true,
    peerDependencies: {
      '@angular/core': '^22.0.0',
      '@angular/common': '^22.0.0',
    },
    devDependencies: {
      '@angular/compiler-cli': '^22.0.0',
    },
  };
  fs.writeFileSync(path.join(outDir, 'package.json'), JSON.stringify(packageJson, null, 2) + '\n');

  const ngPackageJson = {
    $schema: '../../../src/package.schema.json',
    dest: 'dist',
    lib: { entryFile: 'public_api.ts' },
  };
  fs.writeFileSync(path.join(outDir, 'ng-package.json'), JSON.stringify(ngPackageJson, null, 2) + '\n');

  // The primary entry point carries no real component -- all payload lives in the
  // secondary entry points generated by generateFlat()/generateDeep().
  fs.writeFileSync(path.join(outDir, 'public_api.ts'), `export const REFERENCE_VERSION = '1.0.0';\n`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.clean) {
    fs.rmSync(args.out, { recursive: true, force: true });
  }

  writeFixtureRoot(args.out, `${args.layout}-${args.style}`);

  if (args.layout === 'flat') {
    generateFlat(args.out, args.count, args.style);
  } else {
    generateDeep(args.out, args.depth, args.style);
  }

  console.log(`Fixture ready at ${args.out}`);
}

main();
