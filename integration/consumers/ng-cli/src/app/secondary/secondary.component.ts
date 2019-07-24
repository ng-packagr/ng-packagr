import { Component } from '@angular/core';
import { SHARED_FEATURE } from '@sample/secondary/shared';
import { FEATURE_A } from '@sample/secondary/feature-a';
import { FEATURE_B } from '@sample/secondary/feature-b';

export const YEAH_I_AM_RUNNING_IN_A_LOOP_FAST = [SHARED_FEATURE, FEATURE_A, FEATURE_B];

@Component({
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
