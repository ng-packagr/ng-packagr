import { Component, Input } from '@angular/core';

@Component({
  selector: 'ng-component',
  template: '{{ count }}',
})
export class PrimaryAngularComponent {
  @Input()
  count: number;
}
