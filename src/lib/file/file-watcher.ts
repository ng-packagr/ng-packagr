import * as path from 'path';
import * as chokidar from 'chokidar';
import { Observer, Observable } from 'rxjs';
import { ensureUnixPath } from '../util/path';
import * as log from '../util/log';

export type FileWatchEvent = 'change' | 'unlink' | 'add' | 'unlinkDir' | 'addDir';
export interface FileChangedEvent {
  filePath: string;
  event: FileWatchEvent;
}

export function createFileWatch(
  projectPath: string,
  ignoredPaths: (RegExp | string)[] = []
): Observable<FileChangedEvent> {
  log.debug(`Watching for changes: projectPath: ${projectPath}, ignoredPaths: ${ignoredPaths}`);

  const watch = chokidar.watch(projectPath, {
    ignoreInitial: true,
    ignored: [...ignoredPaths, /((^[\/\\])\..)|(\.js$)|(\.map$)|(\.metadata\.json)|(node_modules)/],
    persistent: true
  });

  const handleFileChange = (event: FileWatchEvent, filePath: string, observer: Observer<FileChangedEvent>) => {
    log.debug(`Watch: Path changed. Event: ${event}, Path: ${filePath}`);

    observer.next({
      filePath: path.resolve(ensureUnixPath(filePath)),
      event
    });
  };

  return Observable.create(observer => {
    watch.on('all', (event: FileWatchEvent, filePath: string) => handleFileChange(event, filePath, observer));
    return () => watch.close();
  });
}
