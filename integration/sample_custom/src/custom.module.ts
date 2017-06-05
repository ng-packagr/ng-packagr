import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooComponent } from './foo/foo.component';
import { BarComponent } from './bar/bar.component';
import { InternalService } from './internal.service';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ FooComponent, BarComponent ],
  exports: [ FooComponent, BarComponent ]
})
export class CustomModule {

  public static forRoot(): ModuleWithProviders {

    return {
      ngModule: CustomModule,
      providers: [ InternalService ]
    };
  }
}
