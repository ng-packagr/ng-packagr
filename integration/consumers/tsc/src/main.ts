import { NgModule } from '@angular/core';
import { FooComponent, BarComponent } from 'sample-custom';
import { CoreConsumerModule } from './core-consumer/core-consumer.module';
import { CustomConsulerModule } from './custom-consumer/custom-consumer.module';
import { JsxConsumerModule } from './jsx-consumer/jsx-consumer.module';
import { MaterialConsumerModule } from './material-consumer/material-consumer.module';
import { ModuleImportDirective } from './module-imports';

@NgModule({
  imports: [
    CoreConsumerModule,
    CustomConsulerModule,
    JsxConsumerModule,
    MaterialConsumerModule
  ],
  declarations: [
    FooComponent,
    BarComponent,
    ModuleImportDirective
  ]
})
export class ConsumerModule {}
