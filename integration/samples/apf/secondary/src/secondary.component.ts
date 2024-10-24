import { Component } from '@angular/core';
import { title } from '@sample/apf';

@Component({
  standalone: false,
  selector: 'ng-component',
  template: '<h1>Angular {{name}}!</h1>',
})
export class SecondaryAngularComponent {
  name = title;
}
