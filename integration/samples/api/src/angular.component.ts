import { Component, Input } from '@angular/core';
import jsonData from './angular.component.json';

@Component({
  selector: 'ng-component',
  template: '<h1>{{title}}</h1>{{data}}',
  styleUrls: ['./angular.component.scss'],
})
export class AngularComponent {
  @Input()
  title = 'Angular';

  data = jsonData;
}
