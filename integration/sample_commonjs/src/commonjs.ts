import { serialize } from 'class-transformer';
import * as _ from 'lodash';
import * as moment from 'moment';

export class CommonJSDependency {

  public classTransformer() {
    return serialize({ 'foo': 'bar' });
  }

  public lodashIdentity() {
    return _.identity({ 'foo': 'bar' });
  }

  // Failing: `import * as moment from 'moment';` => `Cannot call a namespace ('moment')` and `import moment from 'moment';` => `"moment" has no default export`
  // public whatTime() {
  //   return moment().format();
  // }

}
