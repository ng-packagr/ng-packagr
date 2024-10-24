import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'ng-component',
  template: '<h1>{{title}}</h1>',
  styleUrls: ['./angular.component.scss'],
})
export class AngularComponent {
  @Input()
  title = 'Angular';
}
