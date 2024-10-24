import { Component, Input } from '@angular/core';
import jsonData from './angular.component2.json';

@Component({
  standalone: false,
  selector: 'ng-component',
  template: '<h1>{{title}}</h1>{{data}}',
  styleUrls: ['./angular.component.scss'],
})
export class AngularComponent {
  @Input()
  title = 'Angular';

  data = jsonData;
}
