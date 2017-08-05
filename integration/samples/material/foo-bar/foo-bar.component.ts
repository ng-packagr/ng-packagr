import { Component } from '@angular/core';

@Component({
  selector: 'foobar-component',
  template: `<h1>{{ title }}</h1>`,
  styleUrls: [ './foo-bar.component.css' ]
})
export class FooBarComponent {

  public title: string = 'foobar!';
}
