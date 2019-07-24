import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondaryAngularComponent } from './secondary.component';
import { PrimaryAngularModule } from 'intra-dependent';

@NgModule({
  imports: [CommonModule, PrimaryAngularModule],
  declarations: [SecondaryAngularComponent],
  exports: [SecondaryAngularComponent],
})
export class SecondaryAngularModule {}
