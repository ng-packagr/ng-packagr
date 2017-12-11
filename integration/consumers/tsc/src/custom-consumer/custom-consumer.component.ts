import { Component } from '@angular/core';

@Component({
  selector: 'custom-consumer',
  template: `
<custom-baz></custom-baz>
<custom-foo></custom-foo>
<custom-foo-bar></custom-foo-bar>
<custom-less-baz></custom-less-baz>
`
})
export class CustomConsumerComponent {
}
