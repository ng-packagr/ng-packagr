import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiLibModule } from '@sample/secondary';
// XX: why not working?!
// import { UiLibModule as SubModule } from '@sample/secondary/sub-module';

@NgModule({
  imports: [
    CommonModule,
    UiLibModule,
//    SubModule
  ],
  declarations: []
})
export class SecondaryModule { }
