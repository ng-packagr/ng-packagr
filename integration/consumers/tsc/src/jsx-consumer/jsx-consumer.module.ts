import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactIntegrationModule } from '@sample/jsx';
import { JsxConsumerComponent } from './jsx-consumer.component';

@NgModule({
  imports: [
    CommonModule,
    ReactIntegrationModule
  ],
  declarations: [
    JsxConsumerComponent
  ],
  exports: [
    JsxConsumerComponent
  ]
})
export class JsxConsumerModule {}
