import { NgModule } from '@angular/core';
import { FooComponent } from './foo/foo.component';
import { BarComponent } from './bar/bar.component';
import { FooBarComponent } from './foo-bar/foo-bar.component';

@NgModule({
  declarations: [
    FooComponent,
    BarComponent,
    FooBarComponent,
  ],
  exports: [
    FooComponent,
    BarComponent,
    FooBarComponent,
  ]
})
export class UiLibModule {}
