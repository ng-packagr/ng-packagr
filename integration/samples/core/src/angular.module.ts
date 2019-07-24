import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularComponent } from './angular.component';
import { AngularDirective } from './angular.directive';
import { AngularPipe } from './angular.pipe';
import { AngularService } from './angular.service';

@NgModule({
  imports: [CommonModule],
  declarations: [AngularComponent, AngularDirective, AngularPipe],
  exports: [AngularComponent, AngularDirective, AngularPipe],
  providers: [AngularService],
})
export class AngularModule {}
