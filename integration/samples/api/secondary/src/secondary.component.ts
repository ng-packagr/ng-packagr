import { Component } from '@angular/core';

@Component({
  selector: 'ng-component-secondary',
  template: '<h1>Angular!</h1><ng-component [title]="2"></ng-component>',
})
export class SecondaryAngularComponent {}
