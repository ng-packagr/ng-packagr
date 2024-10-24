import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'ng-component-secondary',
  template: '<h1>Angular!</h1><ng-component title="foo"></ng-component>',
})
export class SecondaryAngularComponent {}
