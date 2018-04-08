import { InjectionToken } from '@angular/core';
import template from 'lodash.template';

const compiled = template('hello <%= user %>!', null, null);
export const result = compiled({ user: 'fred' });
export const inject = new InjectionToken('token');
