import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooComponent } from './foo/foo.component';
import { BarComponent } from './bar/bar.component';
import { BazComponent } from './baz/baz.component';
import { FooBarComponent } from './foo-bar/foo-bar.component';
import { LessBazComponent } from './less-baz/less-baz.component';
import { InternalService } from './internal.service';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ FooComponent, BarComponent, BazComponent, FooBarComponent, LessBazComponent ],
  exports: [ FooComponent, BarComponent, BazComponent, FooBarComponent ]
})
export class CustomModule {

  public static forRoot(): ModuleWithProviders {

    return {
      ngModule: CustomModule,
      providers: [ InternalService ]
    };
  }
}
