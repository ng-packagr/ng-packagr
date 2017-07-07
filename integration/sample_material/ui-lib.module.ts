import { NgModule } from '@angular/core';
import { FooComponent } from './foo/foo.component';
import { BarComponent } from './bar/bar.component';
import { FooBarComponent } from './foo-bar/foo-bar.component';
import { BazComponent } from './baz/baz.component';

@NgModule({
  declarations: [
    FooComponent,
    BarComponent,
    FooBarComponent,
    BazComponent,
  ],
  exports: [
    FooComponent,
    BarComponent,
    FooBarComponent,
    BazComponent,
  ]
})
export class UiLibModule {}
