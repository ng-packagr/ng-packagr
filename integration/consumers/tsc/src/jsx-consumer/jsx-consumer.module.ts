import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsxConsumerComponent } from './jsx-consumer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [JsxConsumerComponent],
  exports: [JsxConsumerComponent],
})
export class JsxConsumerModule {}
