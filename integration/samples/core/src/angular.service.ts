import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class AngularService {
  private _subject: Subject<any> = new ReplaySubject<any>(1);

  public get bar(): Observable<any> {
    return this._subject.asObservable();
  }

  public static iterableToArray<T>(iterable: Iterable<T>): T[] {
    return [...iterable];
  }
}
