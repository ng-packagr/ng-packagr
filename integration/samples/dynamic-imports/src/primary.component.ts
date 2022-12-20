import { Component } from '@angular/core';

@Component({
  selector: 'ng-component',
  template: '<h1>Angular!</h1>',
})
export class PrimaryAngularComponent {}

export const lazy = import('./sub/lazy-import');
