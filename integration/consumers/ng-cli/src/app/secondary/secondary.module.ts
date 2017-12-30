import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiLibModule } from '@sample/secondary';
// import { BarComponent } from '@sample/secondary/dependent';
import { SHARED_MAGIC_STUFF } from '@sample/secondary/shared-module';
// XX: why not working?!
// import { UiLibModule as SubModule } from '@sample/secondary/sub-module';

@NgModule({
  imports: [
    CommonModule,
    UiLibModule,
//    SubModule
  ],
  declarations: [],
  providers: [
    {
      provide: 'foobar',
      useValue: SHARED_MAGIC_STUFF
    }
  ]
})
export class SecondaryModule { }
