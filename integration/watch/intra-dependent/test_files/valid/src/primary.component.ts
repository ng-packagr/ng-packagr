import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'ng-component',
  template: '{{ count }}',
})
export class PrimaryAngularComponent {
  @Input()
  count: number;
}
