import * as path from 'path';

export const externalModuleIdStrategy = (moduleId: string, embedded: string[] = []): boolean => {
  // more information about why we don't check for 'node_modules' path
  // https://github.com/rollup/rollup-plugin-node-resolve/issues/110#issuecomment-350353632
  if (
    path.isAbsolute(moduleId) ||
    moduleId.startsWith('.') ||
    moduleId.startsWith('/') ||
    moduleId.indexOf('commonjsHelpers') >= 0 || // in case we are embedding a commonjs module we need to include it's helpers also
    embedded.some(x => x === moduleId)
  ) {
    // if it's either 'absolute', marked to embed, starts with a '.' or '/' it's not external
    return false;
  }

  return true;
};
