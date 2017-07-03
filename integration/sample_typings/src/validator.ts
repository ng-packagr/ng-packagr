/// <reference path="./validate-commit-msg.d.ts" />
import { validate } from 'validate-commit-msg';

export const result: boolean = validate("foobar");
