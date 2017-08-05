import { Injectable } from "@angular/core";
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { map } from 'rxjs/operator/map';

@Injectable()
export class AngularService {

  private _subject: Subject<any> = new ReplaySubject<any>(1);

  constructor(
    private http: Http
  ) {}

  public foo(): Observable<string> {
    return map.call(
      this.http.get('/foo/bar'),
      (res: Response) => `${res.ok}`
    );
  }

  public get bar(): Observable<any> {
    return this._subject.asObservable();
  }

}
