import * as chokidar from 'chokidar';
import { platform } from 'os';
import * as path from 'path';
import { Observable, Observer } from 'rxjs';
import * as log from '../utils/log';
import { ensureUnixPath } from '../utils/path';

type AllFileWatchEvents = 'change' | 'unlink' | 'add' | 'unlinkDir' | 'addDir';
export type FileWatchEvent = Exclude<AllFileWatchEvents, 'unlinkDir' | 'addDir'>;

export interface FileChangedEvent {
  filePath: string;
  event: FileWatchEvent;
}

export function createFileWatch(
  basePaths: string | string[],
  ignoredPaths: string[] = [],
  poll?: number,
): {
  watcher: chokidar.FSWatcher;
  onFileChange: Observable<FileChangedEvent>;
} {
  log.debug(`Watching for changes: basePath: ${basePaths}, ignoredPaths: ${ignoredPaths}`);

  const watch = chokidar.watch([], {
    ignoreInitial: true,
    ignored: [
      /\.map$/,
      /.tsbuildinfo$/,
      file => {
        const normalizedPath = ensureUnixPath(file);

        return ignoredPaths.some(f => normalizedPath.startsWith(f));
      },
    ],
    persistent: true,
    usePolling: typeof poll === 'number' ? true : false,
    interval: typeof poll === 'number' ? poll : undefined,
  });

  const isLinux = platform() === 'linux';
  const handleFileChange = (event: AllFileWatchEvents, filePath: string, observer: Observer<FileChangedEvent>) => {
    log.debug(`Watch: Path changed. Event: ${event}, Path: ${filePath}`);

    if (isLinux) {
      // Workaround for Linux where chokidar will not handle future events
      // for files that were unlinked and immediately recreated.
      watch.unwatch(filePath);
      watch.add(filePath);
    }

    if (event === 'unlinkDir' || event === 'addDir') {
      // we don't need to trigger on directory removed or renamed as chokidar will fire the changes for each file
      return;
    }

    observer.next({
      filePath: ensureUnixPath(path.resolve(filePath)),
      event,
    });
  };

  return {
    watcher: watch,
    onFileChange: new Observable(observer => {
      watch.on('all', (event: AllFileWatchEvents, filePath: string) => handleFileChange(event, filePath, observer));

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      return () => watch.close();
    }),
  };
}
