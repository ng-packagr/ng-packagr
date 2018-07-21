import { Component, Input } from '@angular/core';

@Component({
  selector: 'ng-component',
  template: '{{ counter }}'
})
export class PrimaryAngularComponent {
  @Input() counter: string;
}
