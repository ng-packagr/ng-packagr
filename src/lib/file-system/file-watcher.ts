import * as path from 'path';
import * as chokidar from 'chokidar';
import { Observer, Observable } from 'rxjs';
import { ensureUnixPath } from '../utils/path';
import * as log from '../utils/log';

export type FileWatchEvent = 'change' | 'unlink' | 'add' | 'unlinkDir' | 'addDir';

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
    ignored: [...ignoredPaths, /((^[\/\\])\..)|(\.js$)|(\.map$)|(\.metadata\.json)/],
    persistent: true,
  });

  const handleFileChange = (event: FileWatchEvent, filePath: string, observer: Observer<FileChangedEvent>) => {
    log.debug(`Watch: Path changed. Event: ${event}, Path: ${filePath}`);

    const ignoredEvents: FileWatchEvent[] = ['unlinkDir', 'addDir'];

    if (ignoredEvents.includes(event)) {
      // we don't need to trigger on directory removed or renamed as chokidar will fire the changes for each file
      return;
    }

    observer.next({
      filePath: path.resolve(ensureUnixPath(filePath)),
      event,
    });
  };

  return Observable.create(observer => {
    watch.on('all', (event: FileWatchEvent, filePath: string) => handleFileChange(event, filePath, observer));
    return () => watch.close();
  });
}
