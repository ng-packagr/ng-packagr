import { Component } from '@angular/core';
import { SHARED_FEATURE } from '@sample/secondary/shared';

export const YEAH_I_AM_RUNNING_IN_A_LOOP_FAST = [SHARED_FEATURE];

@Component({
  standalone: false,
  selector: 'app-secondary',
  template: `
    <ul>
      <li *ngFor="let string of strings">{{ string }}</li>
    </ul>
  `,
})
export class SecondaryComponent {
  strings = YEAH_I_AM_RUNNING_IN_A_LOOP_FAST;
}
