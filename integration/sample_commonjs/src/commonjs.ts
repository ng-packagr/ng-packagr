import { serialize } from 'class-transformer';

export class CommonJSDependency {

  public foo() {
    return serialize({ 'foo': 'bar' });;
  }

}
