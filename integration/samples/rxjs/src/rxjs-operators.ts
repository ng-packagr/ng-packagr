
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { $$observable as observable } from 'rxjs/symbol/observable';

export class RxJsOperators {

  public observableMap() {
    return Observable.of('foo', 'bar', 'foobar')
      .map((value: string, index: number) => {
        return `Value ${value} at position ${index}`;
      });
  }

  public callMapOperator() {
    return map.call(
      Observable.of('foo', 'bar', 'foobar'),
      (value: string, index: number) => {
        return `Value ${value} at position ${index}`;
      }
    );
  }

  public observableSymbole() {
    return observable;
  }

}
