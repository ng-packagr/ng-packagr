export const umdModuleIdStrategy = (moduleId: string, umdModuleIds: { [key: string]: string } = {}): string => {
  let nameProvided: string | undefined;
  if ((nameProvided = umdModuleIds[moduleId])) {
    return nameProvided;
  }

  let regMatch;
  if ((regMatch = /^\@angular\/platform-browser-dynamic(\/?.*)/.exec(moduleId))) {
    return `ng.platformBrowserDynamic${regMatch[1]}`.replace(/\//g, '.');
  }

  if ((regMatch = /^\@angular\/platform-browser(\/?.*)/.exec(moduleId))) {
    return `ng.platformBrowser${regMatch[1]}`.replace(/\//g, '.');
  }

  if ((regMatch = /^\@angular\/(.+)/.exec(moduleId))) {
    return `ng.${regMatch[1]}`.replace(/\//g, '.');
  }

  if ((regMatch = /^rxjs\/(\/?.*)/.exec(moduleId))) {
    return `rxjs.${regMatch[1]}`;
  }

  return moduleId; // pipe moduleId because rollup will set to null otherwise.
};
