import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondaryAngularComponent } from './secondary.component';
import { AngularModule, TestInterface } from '@sample/api';

@NgModule({
  imports: [CommonModule, AngularModule],
  declarations: [SecondaryAngularComponent],
  exports: [SecondaryAngularComponent],
})
export class SecondaryAngularModule {
  x: TestInterface = {
    title: 'x',
  };
}
