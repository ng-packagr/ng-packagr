import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomModule } from 'sample-custom';
import { CustomConsumerComponent } from './custom-consumer.component';

@NgModule({
  imports: [CommonModule, CustomModule],
  declarations: [CustomConsumerComponent],
  exports: [CustomConsumerComponent],
})
export class CustomConsulerModule {}
