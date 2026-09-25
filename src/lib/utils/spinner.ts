import ora, { type Options, type Ora } from 'ora';
import type { BuildGraph } from '../graph/build-graph';

let activeSpinners = 0;

/**
 * Resets the active spinner count. Intended for testing.
 */
export function resetActiveSpinners(): void {
  activeSpinners = 0;
}

/**
 * Returns the current count of active spinners. Intended for testing.
 */
export function getActiveSpinnersCount(): number {
  return activeSpinners;
}

/**
 * Creates and returns an Ora spinner configured for ng-packagr.
 *
 * When building in parallel or if another spinner is already spinning,
 * the spinner is disabled (`isEnabled: false`) to avoid concurrent spinner
 * corruption and terminal flooding.
 */
export function openSpinner(textOrOptions?: string | Options, graphOrIsParallel?: boolean | BuildGraph): Ora {
  const isParallel =
    typeof graphOrIsParallel === 'boolean' ? graphOrIsParallel : (graphOrIsParallel?.isParallel ?? false);

  const baseOptions: Options = typeof textOrOptions === 'string' ? { text: textOrOptions } : { ...textOrOptions };

  const options: Options = {
    hideCursor: false,
    discardStdin: false,
    ...baseOptions,
    ...(isParallel ? { isEnabled: false } : {}),
  };

  const spinner = ora(options);
  const origStart = spinner.start.bind(spinner);
  const origStop = spinner.stop.bind(spinner);
  let isCounted = false;

  spinner.start = (text?: string) => {
    if (activeSpinners > 0 && !isCounted) {
      spinner.isEnabled = false;
    } else if (spinner.isEnabled && !isCounted) {
      activeSpinners++;
      isCounted = true;
    }

    return origStart(text);
  };

  spinner.stop = () => {
    if (isCounted) {
      activeSpinners--;
      isCounted = false;
    }

    return origStop();
  };

  return spinner;
}
