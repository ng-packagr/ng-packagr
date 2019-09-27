import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'ng-component',
  template: '<h1>Angular!</h1>',
})
export class AngularComponent {
  constructor(cdr: ChangeDetectorRef) {}
}
