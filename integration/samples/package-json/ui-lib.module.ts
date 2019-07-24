import { NgModule } from '@angular/core';

import { BazComponent } from './baz/baz.component';

@NgModule({
  declarations: [BazComponent],
  exports: [BazComponent],
})
export class UiLibModule {}
