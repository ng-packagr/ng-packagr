import { result } from '@sample/externals';
// @ts-expect-error
import template from 'lodash.template';

const compiled = template('hello <%= user %>!', null, null);
export const result_test = result;
