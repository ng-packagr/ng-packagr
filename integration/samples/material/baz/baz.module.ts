import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BazComponent } from './baz.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ BazComponent ],
  exports: [ BazComponent ]
})
export class BazModule {}
