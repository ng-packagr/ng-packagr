import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BuildGraph, ScopedBuildGraph } from '../graph/build-graph';
import { Node } from '../graph/node';
import { getActiveSpinnersCount, openSpinner, resetActiveSpinners } from './spinner';

describe('openSpinner', () => {
  beforeEach(() => {
    resetActiveSpinners();
  });

  afterEach(() => {
    resetActiveSpinners();
  });

  it('should disable spinner when isParallel is true', () => {
    const spinner = openSpinner('Building', true);
    expect(spinner.isEnabled).toBe(false);
  });

  it('should disable spinner when graph has isParallel true', () => {
    const rootGraph = new BuildGraph();
    const node = new Node('ng://test');
    const scopedGraph = new ScopedBuildGraph(rootGraph, node, true);

    const spinner = openSpinner('Building', scopedGraph);
    expect(spinner.isEnabled).toBe(false);
  });

  it('should not force isEnabled to false when isParallel is false', () => {
    const rootGraph = new BuildGraph();
    const node = new Node('ng://test');
    const scopedGraph = new ScopedBuildGraph(rootGraph, node, false);

    const spinner = openSpinner({ text: 'Building', isEnabled: true }, scopedGraph);
    expect(spinner.isEnabled).toBe(true);
  });

  it('should track active spinners and disable concurrent spinners', () => {
    const spinner1 = openSpinner({ isEnabled: true, text: 'Spinner 1' });
    const spinner2 = openSpinner({ isEnabled: true, text: 'Spinner 2' });

    spinner1.start();
    expect(getActiveSpinnersCount()).toBe(1);
    expect(spinner1.isEnabled).toBe(true);

    // Second spinner should be disabled while the first is active
    spinner2.start();
    expect(spinner2.isEnabled).toBe(false);
    expect(getActiveSpinnersCount()).toBe(1);

    // After first spinner succeeds, active count drops
    spinner1.succeed('Done 1');
    expect(getActiveSpinnersCount()).toBe(0);

    // A third spinner can now be enabled
    const spinner3 = openSpinner({ isEnabled: true, text: 'Spinner 3' });
    spinner3.start();
    expect(getActiveSpinnersCount()).toBe(1);
    expect(spinner3.isEnabled).toBe(true);

    spinner3.succeed('Done 3');
    expect(getActiveSpinnersCount()).toBe(0);
  });

  it('should handle multiple start and succeed calls on the same spinner without count drift', () => {
    const spinner = openSpinner({ isEnabled: true, text: 'Multi-step' });

    spinner.start('Step 1');
    expect(getActiveSpinnersCount()).toBe(1);

    spinner.succeed('Step 1 done');
    expect(getActiveSpinnersCount()).toBe(0);

    spinner.start('Step 2');
    expect(getActiveSpinnersCount()).toBe(1);

    spinner.succeed('Step 2 done');
    expect(getActiveSpinnersCount()).toBe(0);
  });

  it('should handle fail, warn, and info calls properly', () => {
    const spinnerFail = openSpinner({ isEnabled: true, text: 'Failing' });
    spinnerFail.start();
    expect(getActiveSpinnersCount()).toBe(1);
    spinnerFail.fail('Failed');
    expect(getActiveSpinnersCount()).toBe(0);

    const spinnerWarn = openSpinner({ isEnabled: true, text: 'Warning' });
    spinnerWarn.start();
    expect(getActiveSpinnersCount()).toBe(1);
    spinnerWarn.warn('Warning');
    expect(getActiveSpinnersCount()).toBe(0);

    const spinnerInfo = openSpinner({ isEnabled: true, text: 'Info' });
    spinnerInfo.start();
    expect(getActiveSpinnersCount()).toBe(1);
    spinnerInfo.info('Info');
    expect(getActiveSpinnersCount()).toBe(0);
  });
});
