import { Component } from '@angular/core';
import { someOtherFoo } from './baz.utils';

@Component({
  standalone: false,
  selector: 'baz-component',
  templateUrl: './baz.component.html',
  styleUrls: ['./baz.component.scss', './baz component.less', './baz.component.sass'],
})
export class BazComponent {
  constructor() {
    console.log(someOtherFoo('abc'));
  }
}
