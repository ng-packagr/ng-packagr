import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'custom-less-baz',
  template: '<h2>LessBaz works!</h2>',
  styleUrls: ['./less-baz.component.less'],
})
export class LessBazComponent {}
