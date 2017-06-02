import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularComponent } from './angular.component';
import { AngularDirective } from './angular.directive';
import { AngularPipe } from './angular.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AngularComponent,
    AngularDirective,
    AngularPipe
  ],
  providers: [

  ]
})
export class AngularModule {}
