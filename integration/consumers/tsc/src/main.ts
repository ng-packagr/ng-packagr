import { NgModule } from '@angular/core';
import { FooComponent, BarComponent } from 'sample-custom';

@NgModule({
  declarations: [
    FooComponent,
    BarComponent
  ]
})
export class ConsumerModule {}
