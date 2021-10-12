import * as chokidar from 'chokidar';
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
  projectPath: string,
  ignoredPaths: (RegExp | string)[] = [],
): Observable<FileChangedEvent> {
  log.debug(`Watching for changes: projectPath: ${projectPath}, ignoredPaths: ${ignoredPaths}`);

  const watch = chokidar.watch(projectPath, {
    ignoreInitial: true,
    ignored: [...ignoredPaths, /((^[/\\])\..)|(\.mjs$)|(\.map$)|(\.metadata\.json|node_modules)/],
    persistent: true,
  });

  const handleFileChange = (event: AllFileWatchEvents, filePath: string, observer: Observer<FileChangedEvent>) => {
    log.debug(`Watch: Path changed. Event: ${event}, Path: ${filePath}`);

    if (event === 'unlinkDir' || event === 'addDir') {
      // we don't need to trigger on directory removed or renamed as chokidar will fire the changes for each file
      return;
    }

    observer.next({
      filePath: ensureUnixPath(path.resolve(filePath)),
      event,
    });
  };

  return Observable.create((observer) => {
    watch.on('all', (event: AllFileWatchEvents, filePath: string) => handleFileChange(event, filePath, observer));

    return () => watch.close();
  });
}
