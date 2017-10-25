import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarComponent } from './bar.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ BarComponent ],
  exports: [ BarComponent ]
})
export class BarModule {}
