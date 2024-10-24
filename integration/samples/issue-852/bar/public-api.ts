import { SomeComponent } from '@my/issue-852/some-component';
import { Directive, InjectionToken, NgModule, Optional } from '@angular/core';

export const BAR_TOKEN = new InjectionToken<string>('bar-token');

@Directive({
  selector: 'input[Bar]',
  standalone: false,
})
export class BarDirective {
  constructor(@Optional() private _formField: SomeComponent) {}
}

@NgModule({
  declarations: [BarDirective],
  exports: [BarDirective],
})
export class BarModule {}
