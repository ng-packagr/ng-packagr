import { Component } from '@angular/core';
import { someOtherFoo } from './baz.utils';

@Component({
  selector: 'baz-component',
  templateUrl: './baz.component.html',
  styleUrls: ['./baz.component.scss', './baz.component.less', './baz.component.styl']
})
export class BazComponent {
  constructor() {
    console.log(someOtherFoo('abc'));
  }
}
