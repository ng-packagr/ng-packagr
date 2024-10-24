import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'ng-component',
  template: '{{ counter }}',
})
export class PrimaryAngularComponent {
  @Input()
  counter: string;
}
