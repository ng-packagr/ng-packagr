import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooComponent } from './foo/foo.component';
import { BarComponent } from './bar/bar.component';
import { FooBarComponent } from './foo-bar/foo-bar.component';
import { BazComponent } from './baz/baz.component';

@NgModule({
  imports: [RouterModule.forChild([])],
  declarations: [FooComponent, BarComponent, FooBarComponent, BazComponent],
  exports: [FooComponent, BarComponent, FooBarComponent, BazComponent],
})
export class UiLibModule {}
