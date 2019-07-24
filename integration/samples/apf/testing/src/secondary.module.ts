import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondaryAngularComponent } from './secondary.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SecondaryAngularComponent],
  exports: [SecondaryAngularComponent],
})
export class SecondaryAngularModule {}
