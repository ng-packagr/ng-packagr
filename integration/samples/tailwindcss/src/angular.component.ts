import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'ng-component',
  template: '<h1>{{title}}</h1>',
  styleUrls: ['./angular.component.css'],
})
export class AngularComponent {
  @Input()
  title = 'Angular';
}
