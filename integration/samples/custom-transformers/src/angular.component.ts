import { Component, Input } from '@angular/core';

@Component({
  selector: 'ng-component',
  template: '<h1>{{title}}</h1>',
})
export class AngularComponent {
  @Input()
  title = 'Angular';
}
