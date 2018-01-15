import { Component } from '@angular/core';


@Component({
  selector: 'ng-component',
  template: '<h1>Angular!</h1>'
})
export class AngularComponent {

  es2016Includes() {
    const arr = ['foo', 'bar'];
    arr.includes('foo');
  }

  es2017String() {
    const str = 'abc';
    str.padStart(10);         // "       abc"
    str.padEnd(10);  // "abc       "
  }
}
