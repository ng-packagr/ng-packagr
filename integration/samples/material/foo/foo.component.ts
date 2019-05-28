import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'foo-component',
  template: 'foo'
})
export class FooComponent {
  doSomething() {}
}
