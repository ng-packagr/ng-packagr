import { Component } from '@angular/core';
import { SHARED_MAGIC_STUFF } from '@sample/secondary/shared-module';

@Component({
  selector: 'dependent-component',
  template: `I depend on {{ message }}`
})
export class BarComponent {

  public message = SHARED_MAGIC_STUFF;
}
