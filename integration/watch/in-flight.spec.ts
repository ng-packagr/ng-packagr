import { cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { pipe } from 'rxjs';
import { expect, it, vi } from 'vitest';
import type { BuildGraph } from '../../dist/src/lib/graph/build-graph';

// Load the compiled package and its DI tokens through the same CommonJS module cache.
const require = createRequire(import.meta.url);
const { ngPackagr } = require('../../dist') as typeof import('../../dist');
const { transformFromPromise } =
  require('../../dist/src/lib/graph/transform') as typeof import('../../dist/src/lib/graph/transform');
const { WRITE_PACKAGE_TRANSFORM_TOKEN } =
  require('../../dist/src/lib/ng-package/entry-point/write-package.di') as typeof import('../../dist/src/lib/ng-package/entry-point/write-package.di');
const { writePackageTransform } =
  require('../../dist/src/lib/ng-package/entry-point/write-package.transform') as typeof import('../../dist/src/lib/ng-package/entry-point/write-package.transform');
const { OPTIONS_TOKEN } =
  require('../../dist/src/lib/ng-package/options.di') as typeof import('../../dist/src/lib/ng-package/options.di');
const { default: log } = require('../../dist/src/lib/utils/log') as typeof import('../../dist/src/lib/utils/log');

it('should emit the latest JavaScript and declarations after a change during a build', async () => {
  const fixture = join(__dirname, '.tmp', 'in-flight');
  const source = join(fixture, 'public_api.ts');
  cpSync(join(__dirname, 'basic'), fixture, { recursive: true });

  let pause: (graph: BuildGraph) => void;
  let release: () => void;
  let complete: () => void;
  let fail: (error: Error) => void;
  const paused = new Promise<BuildGraph>(resolve => (pause = resolve));
  const gate = new Promise<void>(resolve => (release = resolve));
  const completed = new Promise<void>(resolve => (complete = resolve));
  const failed = new Promise<never>((_, reject) => (fail = reject));
  const error = vi.spyOn(log, 'error').mockImplementation(error => {
    fail(error instanceof Error ? error : new Error(error));
  });
  let pausedOnce = false;
  let builds = 0;
  const subscription = ngPackagr()
    .forProject(join(fixture, 'ng-package.json'))
    .withTsConfig(join(fixture, 'tsconfig.ngc.json'))
    .withProviders([
      {
        provide: WRITE_PACKAGE_TRANSFORM_TOKEN,
        deps: [OPTIONS_TOKEN],
        useFactory: options =>
          pipe(
            transformFromPromise(async graph => {
              if (!pausedOnce) {
                pausedOnce = true;
                pause(graph);
                await gate;
              }
            }),
            writePackageTransform(options),
          ),
      },
    ])
    .watch({ cacheEnabled: false, poll: 10 })
    .subscribe({
      next: () => {
        if (++builds === 2) {
          complete();
        }
      },
      error: fail,
    });
  const timeout = setTimeout(() => fail(new Error('Watch build did not complete')), 10000);

  try {
    const graph = await Promise.race([paused, failed]);
    const changed = new Promise<void>(resolveEvent => {
      const handler = (_event: string, file: string) => {
        if (resolve(file) === source) {
          graph.watcher.off('all', handler);
          resolveEvent();
        }
      };
      graph.watcher.on('all', handler);
    });
    writeFileSync(source, readFileSync(source, 'utf-8').replace('hello world', 'in-flight update'));
    await Promise.race([changed, failed]);
    release();
    await Promise.race([completed, failed]);

    expect(error).not.toHaveBeenCalled();
    expect(readFileSync(join(fixture, 'dist/fesm2022/basic.mjs'), 'utf-8')).toContain('in-flight update');
    expect(readFileSync(join(fixture, 'dist/types/basic.d.ts'), 'utf-8')).toContain('in-flight update');
  } finally {
    clearTimeout(timeout);
    release();
    subscription.unsubscribe();
    error.mockRestore();
    rmSync(fixture, { recursive: true, force: true });
  }
}, 15000);
