import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AngularComponent } from './angular.component';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [AngularComponent],
  exports: [AngularComponent],
})
export class AngularModule {}
