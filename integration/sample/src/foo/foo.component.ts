import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'foo-component',
  template: 'foo'
})
export class FooComponent {

  constructor(
    private http: Http
  ) {}

  doSomething() {

    this.http.get('/foo/bar')
      .map((res: Response) => res.ok)
      .subscribe();

  }

}
