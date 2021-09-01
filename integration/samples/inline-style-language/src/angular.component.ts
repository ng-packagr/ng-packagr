import { Component, Input } from '@angular/core';

@Component({
  selector: 'ng-component',
  template: '<h1>{{title}}</h1>',
  styles: [
    `
      $primary: green;
      body {
        color: $primary;
      }
    `,
  ],
})
export class AngularComponent {
  @Input()
  title = 'Angular';
}
