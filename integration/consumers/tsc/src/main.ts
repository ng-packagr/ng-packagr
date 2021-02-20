import { NgModule } from '@angular/core';
import { BarComponent, FooComponent } from 'sample-custom';
import { CoreConsumerModule } from './core-consumer/core-consumer.module';
import { CustomConsumerModule } from './custom-consumer/custom-consumer.module';
import { MaterialConsumerModule } from './material-consumer/material-consumer.module';
import { ModuleImportDirective } from './module-imports';

@NgModule({
  imports: [CoreConsumerModule, CustomConsumerModule, MaterialConsumerModule],
  declarations: [FooComponent, BarComponent, ModuleImportDirective],
})
export class ConsumerModule {}
