import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'ng-component',
  templateUrl: './primary.component.html',
})
export class PrimaryAngularComponent {
  @Input()
  counter: number;
}
