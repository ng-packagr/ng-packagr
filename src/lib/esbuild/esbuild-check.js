// If the platform does not support the native variant of esbuild, this will crash.
// This script can then be spawned by the CLI to determine if native usage is supported.
require('esbuild')
  .formatMessages([], { kind: 'error ' })
  .then(
    () => {},
    () => {},
  );
