import { Component } from '@angular/core';
import { AngularService } from '@sample/core';

@Component({
  selector: 'consumer-core',
  template: `
    <ng-component></ng-component>
    <div ng-directive>
      {{ 'foo' | ngPipe }}
    </div>
  `,
})
export class CoreConsumerComponent {
  constructor(private service: AngularService) {}
}
