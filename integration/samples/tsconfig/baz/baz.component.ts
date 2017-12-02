import { Component } from '@angular/core';

@Component({
  selector: 'baz-component',
  templateUrl: './baz.component.html',
  styleUrls: ['./baz.component.scss']
})
export class BazComponent {
  public computePower(): number {
    return 1 ** 2; // this operator does not exist in es2015
  }
}
