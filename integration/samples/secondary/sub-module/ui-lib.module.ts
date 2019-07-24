import { NgModule } from '@angular/core';

import { BarComponent } from './bar/bar.component';

@NgModule({
  declarations: [BarComponent],
  exports: [BarComponent],
})
export class UiLibModule {}
