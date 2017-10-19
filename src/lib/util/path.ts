import * as nodePath from 'path';

// by exporting this way, we can add custom functions and still be type safe
export const path = {
  ...nodePath,
  ensureUnixPath: (path?: string): string | null => {
    if (!path) {
      return null;
    }

    return path.replace(/\\/g, '/');
  }
};
