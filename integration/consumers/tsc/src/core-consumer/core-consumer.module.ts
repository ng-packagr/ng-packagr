import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularModule } from '@sample/core';
import { CoreConsumerComponent } from './core-consumer.component';

@NgModule({
  imports: [CommonModule, AngularModule],
  declarations: [CoreConsumerComponent],
  exports: [CoreConsumerComponent],
})
export class CoreConsumerModule {}
