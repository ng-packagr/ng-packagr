import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooBarComponent } from './foo-bar.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ FooBarComponent ],
  exports: [ FooBarComponent ]
})
export class FooBarModule {}
