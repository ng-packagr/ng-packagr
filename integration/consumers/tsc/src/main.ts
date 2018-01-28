import { NgModule } from '@angular/core';
import { FooComponent, BarComponent } from 'sample-custom';
import { CoreConsumerModule } from './core-consumer/core-consumer.module';
import { CustomConsumerModule } from './custom-consumer/custom-consumer.module';
import { JsxConsumerModule } from './jsx-consumer/jsx-consumer.module';
import { MaterialConsumerModule } from './material-consumer/material-consumer.module';
import { ModuleImportDirective } from './module-imports';

@NgModule({
  imports: [CoreConsumerModule, CustomConsumerModule, JsxConsumerModule, MaterialConsumerModule],
  declarations: [FooComponent, BarComponent, ModuleImportDirective]
})
export class ConsumerModule {}
