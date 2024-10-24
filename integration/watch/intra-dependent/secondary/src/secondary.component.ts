import { Component } from '@angular/core';
import { PrimaryAngularService } from 'intra-dependent';

@Component({
  standalone: false,
  selector: 'ng-component-secondary',
  template: '<ng-component [count]="count"></ng-component>',
})
export class SecondaryAngularComponent {
  count = 100;

  constructor(service: PrimaryAngularService) {
    service.initialize();
  }
}
