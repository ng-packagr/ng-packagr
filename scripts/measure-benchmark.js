'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { performance } = require('perf_hooks');

const CLI_MAIN = path.resolve(__dirname, '..', 'dist', 'src', 'cli', 'main.js');
const CREATE_REFERENCE = path.resolve(__dirname, 'create-reference.js');
const REFERENCE_DIR = path.resolve(__dirname, '..', 'integration', 'reference');
const CSV_HEADER = 'timestamp,pipeline,mode,fixture,layout,style,entryPoints,iteration,durationMs,status\n';
const PIPELINES = ['promise', 'legacy'];

function parseArgs(argv) {
  const args = {
    fixture: undefined,
    sweep: undefined,
    layout: 'flat',
    style: 'inline',
    iterations: 1,
    out: 'benchmark-results.csv',
    pipeline: 'both',
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--fixture':
        args.fixture = argv[++i];
        break;
      case '--sweep':
        args.sweep = argv[++i].split(',').map(s => parseInt(s.trim(), 10));
        break;
      case '--layout':
        args.layout = argv[++i];
        break;
      case '--style':
        args.style = argv[++i];
        break;
      case '--iterations':
        args.iterations = parseInt(argv[++i], 10);
        break;
      case '--out':
        args.out = argv[++i];
        break;
      case '--pipeline':
        args.pipeline = argv[++i];
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!Number.isInteger(args.iterations) || args.iterations < 1) {
    throw new Error(`--iterations must be a positive integer, got "${args.iterations}"`);
  }
  if (args.sweep && args.sweep.some(n => !Number.isInteger(n) || n < 1)) {
    throw new Error(`--sweep must be a comma-separated list of positive integers, got "${args.sweep}"`);
  }
  if (!['both', ...PIPELINES].includes(args.pipeline)) {
    throw new Error(`--pipeline must be one of both, ${PIPELINES.join(', ')}, got "${args.pipeline}"`);
  }

  return args;
}

/** Pipeline values to actually run, in a fixed order so "both" is always promise-then-legacy. */
function resolvePipelines(args) {
  return args.pipeline === 'both' ? PIPELINES : [args.pipeline];
}

function assertCliIsBuilt() {
  if (!fs.existsSync(CLI_MAIN)) {
    console.error(
      `Cannot find ${CLI_MAIN}.\nRun "pnpm build" first -- the benchmark measures the real compiled CLI, not the TypeScript source.`,
    );
    process.exit(1);
  }
}

function countEntryPoints(dir) {
  let count = 0;
  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === 'dist') {
        continue;
      }
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name === 'ng-package.json') {
        count++;
      }
    }
  }
  walk(dir);
  return count - 1; // exclude the primary entry point
}

function buildOnce(ngPackageJsonPath, pipeline) {
  const env = { ...process.env, NG_PACKAGR_LEGACY_PIPELINE: pipeline === 'legacy' ? 'true' : 'false' };
  const start = performance.now();
  const result = spawnSync(process.execPath, [CLI_MAIN, '-p', ngPackageJsonPath], {
    stdio: 'pipe',
    env,
    maxBuffer: Infinity,
  });
  const durationMs = performance.now() - start;
  const status = result.status === 0 ? 'ok' : 'fail';
  if (status === 'fail') {
    console.error(result.stderr.toString());
  }
  return { durationMs, status };
}

function appendRows(outPath, rows) {
  const isNewFile = !fs.existsSync(outPath);
  if (isNewFile) {
    fs.writeFileSync(outPath, CSV_HEADER);
  }
  const lines = rows
    .map(r =>
      [
        r.timestamp,
        r.pipeline,
        r.mode,
        r.fixture,
        r.layout,
        r.style,
        r.entryPoints,
        r.iteration,
        r.durationMs.toFixed(2),
        r.status,
      ].join(','),
    )
    .join('\n');
  fs.appendFileSync(outPath, lines + '\n');
}

function benchmarkFixture(dir, iterations, pipeline) {
  const ngPackageJsonPath = path.join(dir, 'ng-package.json');
  const fixtureName = path.basename(dir);
  const entryPoints = countEntryPoints(dir);
  const rows = [];

  for (let i = 1; i <= iterations; i++) {
    console.log(`[fixture] ${fixtureName} (${entryPoints} entry points, ${pipeline}) -- run ${i}/${iterations}`);
    const { durationMs, status } = buildOnce(ngPackageJsonPath, pipeline);
    console.log(`  ${status === 'ok' ? 'done' : 'FAILED'} in ${(durationMs / 1000).toFixed(2)}s`);
    rows.push({
      timestamp: new Date().toISOString(),
      pipeline,
      mode: 'fixture',
      fixture: fixtureName,
      layout: fixtureName.includes('deep') ? 'deep' : 'flat',
      style: fixtureName.replace(/^apf-reference-(flat|deep)-/, ''),
      entryPoints,
      iteration: i,
      durationMs,
      status,
    });
  }
  return rows;
}

function runFixtureMode(args) {
  const dirs = args.fixture
    ? [path.resolve(args.fixture)]
    : fs
        .readdirSync(REFERENCE_DIR, { withFileTypes: true })
        .filter(e => e.isDirectory() && e.name.startsWith('apf-reference-'))
        .map(e => path.join(REFERENCE_DIR, e.name));

  if (dirs.length === 0) {
    console.error(`No fixtures found under ${REFERENCE_DIR}. Run the "reference:*" npm scripts first.`);
    process.exit(1);
  }

  const pipelines = resolvePipelines(args);
  // For each fixture, run both pipeline variants back-to-back rather than all-of-one-pipeline-
  // then-all-of-the-other -- minimizes machine-state drift (thermal throttling, cache warmth)
  // between the two series being compared.
  const rows = dirs.flatMap(dir => pipelines.flatMap(pipeline => benchmarkFixture(dir, args.iterations, pipeline)));
  appendRows(args.out, rows);
  console.log(`\nWrote ${rows.length} row(s) to ${args.out}`);
}

function runSweepMode(args) {
  const scratchRoot = path.resolve(__dirname, '..', '.benchmark-tmp');
  const pipelines = resolvePipelines(args);
  const rows = [];

  for (const count of args.sweep) {
    const label = `sweep-${args.layout}-${args.style}-${count}`;
    const scratchDir = path.join(scratchRoot, label);

    console.log(`\n[sweep] generating ${count} entry points (${args.layout}/${args.style})...`);
    const gen = spawnSync(
      process.execPath,
      [
        CREATE_REFERENCE,
        '--layout',
        args.layout,
        '--style',
        args.style,
        '--count',
        String(count),
        '--out',
        scratchDir,
        '--clean',
      ],
      {
        stdio: 'inherit',
      },
    );
    if (gen.status !== 0) {
      throw new Error(`create-reference.js failed for count=${count}`);
    }

    // Pipeline is the inner loop (same generated fixture reused for both variants) so the
    // two series being compared run back-to-back at each size, rather than all-of-one-pipeline-
    // then-all-of-the-other -- minimizes machine-state drift between them.
    for (const pipeline of pipelines) {
      for (let i = 1; i <= args.iterations; i++) {
        console.log(`[sweep] ${count} entry points, ${pipeline} -- run ${i}/${args.iterations}`);
        const { durationMs, status } = buildOnce(path.join(scratchDir, 'ng-package.json'), pipeline);
        console.log(`  ${status === 'ok' ? 'done' : 'FAILED'} in ${(durationMs / 1000).toFixed(2)}s`);
        rows.push({
          timestamp: new Date().toISOString(),
          pipeline,
          mode: 'sweep',
          fixture: label,
          layout: args.layout,
          style: args.style,
          entryPoints: count,
          iteration: i,
          durationMs,
          status,
        });
      }
    }

    fs.rmSync(scratchDir, { recursive: true, force: true });
  }

  fs.rmSync(scratchRoot, { recursive: true, force: true });
  appendRows(args.out, rows);
  console.log(`\nWrote ${rows.length} row(s) to ${args.out}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  assertCliIsBuilt();

  if (args.sweep) {
    runSweepMode(args);
  } else {
    runFixtureMode(args);
  }
}

main();
