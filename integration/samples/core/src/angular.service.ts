import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs';
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

export async function foo(): Promise<void> {
 return undefined;
}