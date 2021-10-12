import * as ansiColors from 'ansi-colors';
import { WriteStream } from 'tty';

type AnsiColors = typeof ansiColors;

const supportsColor = process.stdout instanceof WriteStream && process.stdout.getColorDepth() > 1;

// Create a separate instance to prevent unintended global changes to the color configuration
// Create function is not defined in the typings. See: https://github.com/doowb/ansi-colors/pull/44
const colors = (ansiColors as AnsiColors & { create: () => AnsiColors }).create();
colors.enabled = supportsColor;

export { colors };
