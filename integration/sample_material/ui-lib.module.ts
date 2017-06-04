import { NgModule } from '@angular/core';
import { FooComponent } from './foo/foo.component';
import { BarComponent } from './bar/bar.component';


@NgModule({
  declarations: [
    FooComponent,
    BarComponent
  ],
  exports: [
    FooComponent,
    BarComponent
  ]
})
export class UiLibModule {}
