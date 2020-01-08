import { Component, Input } from '@angular/core';
import { getSampleApi } from '@ts-path/api';
@Component({
  selector: 'ng-component',
  template: '<h1>{{title}}</h1>',
  styleUrls: ['./angular.component.scss'],
})
export class AngularComponent {
  @Input() title = 'Angular';

  constructor() {
    console.log(getSampleApi());
  }
}
