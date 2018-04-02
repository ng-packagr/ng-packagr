export const umdModuleIdStrategy = (moduleId: string, umdModuleIds: { [key: string]: string } = {}): string => {
  let nameProvided: string | undefined;
  if ((nameProvided = umdModuleIds[moduleId])) {
    return nameProvided;
  }

  let regMatch;
  if ((regMatch = /^\@angular\/platform-browser-dynamic(\/?.*)/.exec(moduleId))) {
    return `ng.platformBrowserDynamic${regMatch[1]}`.replace('/', '.');
  }

  if ((regMatch = /^\@angular\/platform-browser(\/?.*)/.exec(moduleId))) {
    return `ng.platformBrowser${regMatch[1]}`.replace('/', '.');
  }

  if ((regMatch = /^\@angular\/(.+)/.exec(moduleId))) {
    return `ng.${regMatch[1]}`.replace('/', '.');
  }

  if (/^rxjs\/(add\/)?observable/.test(moduleId)) {
    return 'Rx.Observable';
  }

  if (/^rxjs\/scheduler/.test(moduleId)) {
    return 'Rx.Scheduler';
  }

  if (/^rxjs\/symbol/.test(moduleId)) {
    return 'Rx.Symbol';
  }

  if (/^rxjs\/(add\/)?operator/.test(moduleId)) {
    return 'Rx.Observable.prototype';
  }

  if (/^rxjs\/[^\/]+$/.test(moduleId)) {
    return 'Rx';
  }

  if ((regMatch = /^rxjs\/util\/(\/?.*)/.exec(moduleId))) {
    return `Rx.${regMatch[1]}`;
  }

  if (moduleId === 'tslib') {
    return 'tslib';
  }

  return ''; // leave it up to rollup to guess the global name
};
