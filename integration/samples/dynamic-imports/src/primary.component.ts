import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'ng-component',
  template: '<h1>Angular!</h1>',
})
export class PrimaryAngularComponent {}

export const lazy = import('./sub/lazy-import');
