import { Component, ContentChild, ElementRef } from '@angular/core';

@Component({
  standalone: false,
  selector: 'custom-foo-bar',
  templateUrl: './foo-bar.component.html',
})
export class FooBarComponent {
  @ContentChild('heading', { read: ElementRef, static: true })
  buttons: ElementRef;

  constructor(private elementRef: ElementRef) {}

  inlineButtons: any[] = [];
  menuButtons: any[] = [];
}
