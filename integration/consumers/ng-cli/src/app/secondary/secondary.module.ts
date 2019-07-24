import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiLibModule } from '@sample/secondary';
import { UiLibModule as SubModule } from '@sample/secondary/sub-module';
import { SecondaryComponent } from './secondary.component';

@NgModule({
  imports: [CommonModule, UiLibModule, SubModule],
  declarations: [SecondaryComponent],
  exports: [SecondaryComponent],
})
export class SecondaryModule {}
