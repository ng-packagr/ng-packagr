import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularComponent } from './angular.component';
@NgModule({
  imports: [CommonModule],
  declarations: [AngularComponent],
  exports: [AngularComponent],
  providers: [],
})
export class AngularModule {}

export interface TestInterface {
  name?: string;
  title: string;
}
