import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'some-component',
  template: '',
})
export class SomeComponent {
  constructor() {}
}

@NgModule({
  declarations: [SomeComponent],
  exports: [SomeComponent],
})
export class SomeComponentModule {}
