import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryAngularComponent } from './primary.component';
import { PrimaryAngularService } from './primary.service';

@NgModule({
  imports: [CommonModule],
  declarations: [PrimaryAngularComponent],
  providers: [PrimaryAngularService],
  exports: [PrimaryAngularComponent],
})
export class PrimaryAngularModule {}
