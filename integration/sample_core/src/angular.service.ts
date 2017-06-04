import { Injectable } from "@angular/core";
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AngularService {

  constructor(
    private http: Http
  ) {}

  public foo(): Observable<string> {

    return this.http.get('/foo/bar')
      .map((res: Response) => `${res.ok}`);
  }

}
