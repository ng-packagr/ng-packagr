import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryAngularComponent } from './primary.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PrimaryAngularComponent],
  exports: [PrimaryAngularComponent],
})
export class PrimaryAngularModule {}
