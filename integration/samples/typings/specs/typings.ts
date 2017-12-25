import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

describe(`sample-typings`, () => {
  describe(`validator.d.ts`, () => {
    let VALIDATOR_DTS;
    before(() => {
      VALIDATOR_DTS = fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'validator.d.ts'), 'utf-8');
    });

    it(`should triple-slash reference to 'src/chalk.d.ts'`, () => {
      /// <reference path="src/chalk.d.ts" />
      expect(VALIDATOR_DTS).to.contain('src/chalk.d.ts');
      expect(VALIDATOR_DTS).to.satisfy(
        (value: string) => value.startsWith(`/// <reference path="src/chalk.d.ts" />`),
        'Expected validator.d.ts to contain a triple-slash reference');
    });
  });

  describe(`src/chalk.d.ts`, () => {
    let CHALK_DTS;
    before(() => {
      CHALK_DTS = fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'src', 'chalk.d.ts'), 'utf-8');
    });

    it(`should exist in 'dist' folder`, () => {
      expect(CHALK_DTS).to.be.ok;
    });
  });
});
