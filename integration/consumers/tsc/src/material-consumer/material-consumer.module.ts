import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiLibModule } from '@sample/material';
import { BarConsumerComponent } from './bar-consumer.componene';
import { BazConsumerComponent } from './baz-consumer.componene';
import { FoobarConsumerComponent } from './foo-bar-consumer.componene';
import { FooConsumerComponent } from './foo-consumer.componene';

@NgModule({
  imports: [CommonModule, UiLibModule],
  declarations: [BarConsumerComponent, BazConsumerComponent, FoobarConsumerComponent, FooConsumerComponent],
  exports: [BarConsumerComponent, BazConsumerComponent, FoobarConsumerComponent, FooConsumerComponent],
})
export class MaterialConsumerModule {}
