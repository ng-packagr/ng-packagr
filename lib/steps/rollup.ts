const __rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
import { debug } from '../util/log';

export interface RollupOptions {
  moduleName: string,
  entry: string,
  format: string,
  dest: string
}

/**
 * Runs rollup over the given entry file, bundling it up.
 *
 * @param opts
 */
export const rollup = (opts: RollupOptions) => {
  const ROLLUP_GLOBALS = {
    // Angular dependencies
    '@angular/animations':  'ng.animations',
    '@angular/core':        'ng.core',
    '@angular/common':      'ng.common',
    '@angular/forms':       'ng.forms',
    '@angular/http':        'ng.http',
    '@angular/platform-browser':            'ng.platformBrowser',
    '@angular/platform-browser-dynamic':    'ng.platformBrowserDynamic',
    '@angular/platform-browser/animations': 'ng.platformBrowser.animations',
    '@angular/router':      'ng.router',
    // RxJS dependencies
    'rxjs/AnonymousSubject':      'Rx',
    'rxjs/AsyncSubject':          'Rx',
    'rxjs/BehaviorSubject':       'Rx',
    'rxjs/Notifiction':           'Rx',
    'rxjs/ObservableInput':       'Rx',
    'rxjs/Observable':            'Rx',
    'rxjs/Observer':              'Rx',
    'rxjs/ReplaySubject':         'Rx',
    'rxjs/Scheduler':             'Rx',
    'rxjs/Subject':               'Rx',
    'rxjs/SubjectSubscriber':     'Rx',
    'rxjs/SubscribableOrPromise': 'Rx',
    'rxjs/Subscriber':            'Rx',
    'rxjs/Subscription':          'Rx',
    'rxjs/TeardownLogic':         'Rx',
    'rxjs/add/observable/fromPromise':      'Rx.Observable',
    'rxjs/add/observable/of':               'Rx.Observable',
    'rxjs/add/observable/bindCallback':     'Rx.Observable',
    'rxjs/add/observable/bindNodeCallback': 'Rx.Observable',
    'rxjs/add/observable/combineLatest':    'Rx.Observable',
    'rxjs/add/observable/concat':           'Rx.Observable',
    'rxjs/add/observable/create':           'Rx.Observable',
    'rxjs/add/observable/defer':            'Rx.Observable',
    'rxjs/add/observable/empty':            'Rx.Observable',
    'rxjs/add/observable/forkJoin':         'Rx.Observable',
    'rxjs/add/observable/from':             'Rx.Observable',
    'rxjs/add/observable/fromEvent':        'Rx.Observable',
    'rxjs/add/observable/fromEventPattern': 'Rx.Observable',
    'rxjs/add/observable/interval':         'Rx.Observable',
    'rxjs/add/observable/merge':            'Rx.Observable',
    'rxjs/add/observable/never':            'Rx.Observable',
    'rxjs/add/observable/range':            'Rx.Observable',
    'rxjs/add/observable/throw':            'Rx.Observable',
    'rxjs/add/observable/timer':            'Rx.Observable',
    'rxjs/add/observable/webSocket':        'Rx.Observable',
    'rxjs/add/observable/zip':              'Rx.Observable',
    'rxjs/add/operator/audit':          'Rx.Observable.prototype',
    'rxjs/add/operator/auditTime':      'Rx.Observable.prototype',
    'rxjs/add/operator/buffer':         'Rx.Observable.prototype',
    'rxjs/add/operator/bufferCount':    'Rx.Observable.prototype',
    'rxjs/add/operator/bufferTime':     'Rx.Observable.prototype',
    'rxjs/add/operator/bufferToggle':   'Rx.Observable.prototype',
    'rxjs/add/operator/bufferWhen':     'Rx.Observable.prototype',
    'rxjs/add/operator/catch':          'Rx.Observable.prototype',
    'rxjs/add/operator/combineAll':     'Rx.Observable.prototype',
    'rxjs/add/operator/combineLatest':  'Rx.Observable.prototype',
    'rxjs/add/operator/concat':         'Rx.Observable.prototype',
    'rxjs/add/operator/concatAll':      'Rx.Observable.prototype',
    'rxjs/add/operator/concatMap':      'Rx.Observable.prototype',
    'rxjs/add/operator/concatMapTo':    'Rx.Observable.prototype',
    'rxjs/add/operator/count':          'Rx.Observable.prototype',
    'rxjs/add/operator/debounce':       'Rx.Observable.prototype',
    'rxjs/add/operator/debounceTime':   'Rx.Observable.prototype',
    'rxjs/add/operator/defaultIfEmpty': 'Rx.Observable.prototype',
    'rxjs/add/operator/delay':          'Rx.Observable.prototype',
    'rxjs/add/operator/delayWhen':      'Rx.Observable.prototype',
    'rxjs/add/operator/dematerialize':  'Rx.Observable.prototype',
    'rxjs/add/operator/distinct':       'Rx.Observable.prototype',
    'rxjs/add/operator/distinctUntilChanged':     'Rx.Observable.prototype',
    'rxjs/add/operator/distinctUntilKeyChanged':  'Rx.Observable.prototype',
    'rxjs/add/operator/do':             'Rx.Observable.prototype',
    'rxjs/add/operator/elementAt':      'Rx.Observable.prototype',
    'rxjs/add/operator/every':          'Rx.Observable.prototype',
    'rxjs/add/operator/exhaust':        'Rx.Observable.prototype',
    'rxjs/add/operator/exhaustMap':     'Rx.Observable.prototype',
    'rxjs/add/operator/expand':         'Rx.Observable.prototype',
    'rxjs/add/operator/filter':         'Rx.Observable.prototype',
    'rxjs/add/operator/find':           'Rx.Observable.prototype',
    'rxjs/add/operator/findIndex':      'Rx.Observable.prototype',
    'rxjs/add/operator/first':          'Rx.Observable.prototype',
    'rxjs/add/operator/forEach':        'Rx.Observable.prototype',
    'rxjs/add/operator/finally':        'Rx.Observable.prototype',
    'rxjs/add/operator/groupBy':        'Rx.Observable.prototype',
    'rxjs/add/operator/ignoreElements': 'Rx.Observable.prototype',
    'rxjs/add/operator/isEmpty':        'Rx.Observable.prototype',
    'rxjs/add/operator/last':           'Rx.Observable.prototype',
    'rxjs/add/operator/letProto':       'Rx.Observable.prototype',
    'rxjs/add/operator/lift':           'Rx.Observable.prototype',
    'rxjs/add/operator/map':            'Rx.Observable.prototype',
    'rxjs/add/operator/materialize':    'Rx.Observable.prototype',
    'rxjs/add/operator/max':            'Rx.Observable.prototype',
    'rxjs/add/operator/merge':          'Rx.Observable.prototype',
    'rxjs/add/operator/mergeAll':       'Rx.Observable.prototype',
    'rxjs/add/operator/mergeMap':       'Rx.Observable.prototype',
    'rxjs/add/operator/mergeMapTo':     'Rx.Observable.prototype',
    'rxjs/add/operator/mergeScan':      'Rx.Observable.prototype',
    'rxjs/add/operator/min':            'Rx.Observable.prototype',
    'rxjs/add/operator/multicast':      'Rx.Observable.prototype',
    'rxjs/add/operator/observeOn':      'Rx.Observable.prototype',
    'rxjs/add/operator/pairwise':       'Rx.Observable.prototype',
    'rxjs/add/operator/partition':      'Rx.Observable.prototype',
    'rxjs/add/operator/pluck':          'Rx.Observable.prototype',
    'rxjs/add/operator/publish':        'Rx.Observable.prototype',
    'rxjs/add/operator/publishBehavior':'Rx.Observable.prototype',
    'rxjs/add/operator/publishLast':    'Rx.Observable.prototype',
    'rxjs/add/operator/publishReplay':  'Rx.Observable.prototype',
    'rxjs/add/operator/race':           'Rx.Observable.prototype',
    'rxjs/add/operator/reduce':         'Rx.Observable.prototype',
    'rxjs/add/operator/repeat':         'Rx.Observable.prototype',
    'rxjs/add/operator/repeatWhen':     'Rx.Observable.prototype',
    'rxjs/add/operator/retry':          'Rx.Observable.prototype',
    'rxjs/add/operator/retryWhen':      'Rx.Observable.prototype',
    'rxjs/add/operator/sample':         'Rx.Observable.prototype',
    'rxjs/add/operator/sampleTime':     'Rx.Observable.prototype',
    'rxjs/add/operator/scan':           'Rx.Observable.prototype',
    'rxjs/add/operator/sequenceEqual':  'Rx.Observable.prototype',
    'rxjs/add/operator/share':          'Rx.Observable.prototype',
    'rxjs/add/operator/single':         'Rx.Observable.prototype',
    'rxjs/add/operator/skip':           'Rx.Observable.prototype',
    'rxjs/add/operator/skipUntil':      'Rx.Observable.prototype',
    'rxjs/add/operator/skipWhile':      'Rx.Observable.prototype',
    'rxjs/add/operator/startWith':      'Rx.Observable.prototype',
    'rxjs/add/operator/subscribeOn':    'Rx.Observable.prototype',
    'rxjs/add/operator/switch':         'Rx.Observable.prototype',
    'rxjs/add/operator/switchMap':      'Rx.Observable.prototype',
    'rxjs/add/operator/switchMapTo':    'Rx.Observable.prototype',
    'rxjs/add/operator/take':           'Rx.Observable.prototype',
    'rxjs/add/operator/takeLast':       'Rx.Observable.prototype',
    'rxjs/add/operator/takeUntil':      'Rx.Observable.prototype',
    'rxjs/add/operator/takeWhile':      'Rx.Observable.prototype',
    'rxjs/add/operator/throttle':       'Rx.Observable.prototype',
    'rxjs/add/operator/throttleTime':   'Rx.Observable.prototype',
    'rxjs/add/operator/timeInterval':   'Rx.Observable.prototype',
    'rxjs/add/operator/timeout':        'Rx.Observable.prototype',
    'rxjs/add/operator/timeoutWith':    'Rx.Observable.prototype',
    'rxjs/add/operator/timestamp':      'Rx.Observable.prototype',
    'rxjs/add/operator/toArray':        'Rx.Observable.prototype',
    'rxjs/add/operator/toPromise':      'Rx.Observable.prototype',
    'rxjs/add/operator/window':         'Rx.Observable.prototype',
    'rxjs/add/operator/windowCount':    'Rx.Observable.prototype',
    'rxjs/add/operator/windowToggle':   'Rx.Observable.prototype',
    'rxjs/add/operator/windowWhen':     'Rx.Observable.prototype',
    'rxjs/add/operator/withLatestFrom': 'Rx.Observable.prototype',
    'rxjs/add/operator/zipAll':         'Rx.Observable.prototype',
    'rxjs/add/operator/zipProto':       'Rx.Observable.prototype'
  };

  let bundleOptions = {
    context: 'this',
    external: Object.keys(ROLLUP_GLOBALS),
    entry: opts.entry,
    plugins: [
        nodeResolve({ jsnext: true, module: true }),
    ],
    onwarn: (warning) => {
        if (warning.code === 'THIS_IS_UNDEFINED') {
          return;
        }

        console.warn(warning.message);
    }
  };

  let writeOptions = {
    // Keep the moduleId empty because we don't want to force developers to a specific moduleId.
    moduleId: '',
    moduleName: `${opts.moduleName}`,
    banner: '',
    format: opts.format,
    dest: opts.dest,
    globals: ROLLUP_GLOBALS,
    sourceMap: true
  };

  debug(`rollup ${opts.entry} to ${opts.dest} (${opts.format})`);

  return __rollup.rollup(bundleOptions).then((bundle: any) => bundle.write(writeOptions));
}
