# Benchmarking: legacy rxjs/DI pipeline vs. promise-based pipeline

ng-packagr's internal transformation pipeline is being migrated off the rxjs/injection-js
system (`buildAsObservable`, `packageTransformFactory`) onto a plain `async/await` pipeline
(`buildNgPackage` / `watchNgPackage` in `src/lib/v23/`), as part of evaluating whether the
simpler pipeline can replace the legacy one long-term. This doc describes how to run a
repeatable A/B benchmark round comparing the two.

## How the two pipelines are selected

`src/lib/packagr.ts` reads the `NG_PACKAGR_LEGACY_PIPELINE` environment variable at runtime:

- unset, or any value other than `"true"` → **promise pipeline** (the default)
- `NG_PACKAGR_LEGACY_PIPELINE=true` → **legacy rxjs/DI pipeline**

`scripts/measure-benchmark.js` sets this automatically based on its own `--pipeline` flag
(`promise`, `legacy`, or `both`) — you don't need to set the environment variable by hand when
using the benchmark script.

## Benchmark combos

Four fixture shapes are benchmarked, covering the two axes `create-reference.js` can vary
(entry-point layout and stylesheet style). Each row below uses only the existing, already
supported flags on `scripts/measure-benchmark.js` and `scripts/create-reference.js` — no script
changes are needed to run this.

| Combo | Layout | Style       | Size dimension    | Sweep values                                                          | How it's run                                |
| ----- | ------ | ----------- | ----------------- | --------------------------------------------------------------------- | ------------------------------------------- |
| 1     | flat   | inline      | entry-point count | 10, 20, 30, 40, 50, 100, 200, 300, 400, 500, 1000, 2000               | `measure-benchmark.js --sweep ...`          |
| 2     | flat   | inline-scss | entry-point count | 10, 20, 30, 40, 50, 100, 200, 300, 400, 500, 1000, 2000               | `measure-benchmark.js --sweep ...`          |
| 3     | flat   | external    | entry-point count | 10, 20, 30, 40, 50, 100, 200, 300, 400, 500, 1000, 2000               | `measure-benchmark.js --sweep ...`          |
| 4     | deep   | inline      | tree depth        | 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 (→ 4, 8, 16, ..., 2048 actual entries) | generate-then-measure per depth (see below) |

Every invocation uses `--pipeline both` so the promise and legacy pipelines run back-to-back for
each size, and `--iterations 3` (1 warmup + 2 measured runs) per cell.

**Scale:** 3 flat combos × 12 sizes × 2 pipelines × 3 iterations = 216 builds, plus 1 deep combo
× 10 depths × 2 pipelines × 3 iterations = 60 builds — **276 CLI builds total**. The largest
cells (2000 entries; depth 10/11 = 1024/2048 entries) dominate wall-clock time. Expect the full
round to take a long time to complete.

### Why the deep combo is handled differently

`measure-benchmark.js --sweep` always generates fixtures by passing `--count <N>` to
`create-reference.js`. But `create-reference.js` only honors `--count` for `--layout flat` — for
`--layout deep` it sizes the fixture via a separate `--depth` argument (actual entry count =
2^depth) and ignores `--count` entirely. So `--sweep` cannot drive the deep layout's size.

Workaround: for each depth, generate the fixture directly with `create-reference.js --depth <d>`,
then measure that one fixture with `measure-benchmark.js --fixture <dir>` (single-fixture mode,
which has no such limitation) instead of `--sweep`.

## Running the benchmark

1. **Build first.** `measure-benchmark.js` measures the compiled CLI, not TypeScript source:

   ```sh
   pnpm build
   ```

2. **Start from a clean output file.** `measure-benchmark.js` appends rows to its `--out` CSV
   rather than overwriting it, so stray rows from earlier ad-hoc runs will mix into your dataset
   if left in place. Remove or rename any existing `benchmark-results.csv` before starting a real
   round:

   ```sh
   rm -f benchmark-results.csv
   ```

3. **Run the three flat combos** (works today via `--sweep`, no workaround needed):

   ```sh
   node scripts/measure-benchmark.js --layout flat --style inline \
     --sweep 10,20,30,40,50,100,200,300,400,500,1000,2000 --pipeline both --iterations 3

   node scripts/measure-benchmark.js --layout flat --style inline-scss \
     --sweep 10,20,30,40,50,100,200,300,400,500,1000,2000 --pipeline both --iterations 3

   node scripts/measure-benchmark.js --layout flat --style external \
     --sweep 10,20,30,40,50,100,200,300,400,500,1000,2000 --pipeline both --iterations 3
   ```

   All three append to the default `benchmark-results.csv` (pass `--out <file>` explicitly to
   use a different path, as long as it's the same path for every invocation in the round).

4. **Run the deep combo**, one depth at a time, using the generate-then-measure workaround:

   ```sh
   for depth in 2 3 4 5 6 7 8 9 10 11; do
     node scripts/create-reference.js --layout deep --style inline --depth "$depth" \
       --out .benchmark-tmp/deep-inline-depth-"$depth" --clean
     node scripts/measure-benchmark.js --fixture .benchmark-tmp/deep-inline-depth-"$depth" \
       --pipeline both --iterations 3
   done
   rm -rf .benchmark-tmp
   ```

5. **Inspect `benchmark-results.csv`** once the round completes — it should contain
   `3 flat combos × 12 sizes + 1 deep combo × 10 depths = 46` size points, each with
   `2 pipelines × 3 iterations = 6` rows, for 276 rows total.

Because this is a long-running sequence, consider running it in the background (e.g. `nohup ... &`
or a terminal multiplexer) and checking the CSV's row count periodically rather than waiting on it
interactively.

## Interpreting results

- **Discard the first iteration per cell as warmup** before computing summary statistics — it
  typically includes one-time costs (OS file-cache warming, JIT warmup) that don't reflect steady
  state.
- **Compare medians, not means.** Wall-clock timings around a spawned CLI process are noisy and
  right-skewed (occasional slow outliers from GC pauses, scheduler contention, etc.); the median
  of the 2 measured iterations per cell is more representative than their mean.
- **Keep the two pipeline series back-to-back per cell**, as this benchmark round already does
  (`--pipeline both` runs promise then legacy immediately after, for the same fixture) — this
  minimizes machine-state drift (thermal throttling, filesystem cache warmth) between the two
  series being compared. Avoid running "all promise sizes, then all legacy sizes" as a separate
  pass, since machine conditions can drift between the two passes and bias the comparison.
- **Run the whole round on one otherwise-idle machine** in one sitting. Comparing numbers
  collected on different machines, or alongside other heavy background load, is not meaningful.

## Out of scope: watch-mode benchmarking

This round only measures cold, one-shot builds (`ng-packagr -p <project>`). It does not exercise
`watch()` or incremental rebuild latency, even though a meaningful share of the pipeline migration
work targets the watch pipeline specifically. Watch-mode benchmarking needs new tooling (a script
that drives the CLI's `-w` flag as a long-lived process and times file-edit-to-rebuild-complete)
and is deferred to a follow-up round.
