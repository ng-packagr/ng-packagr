import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

describe(`sample-typings`, () => {
  describe(`validator.d.ts`, () => {
    let VALIDATOR_DTS;
    before(() => {
      VALIDATOR_DTS = fs.readFileSync(path.resolve(__dirname, '..', 'dist', 'validator.d.ts'), 'utf-8');
    });

    it(`should triple-slash reference 'chalk.d.ts'`, () => {
      /// <reference path="chalk.d.ts" />
      expect(VALIDATOR_DTS).to.contain('chalk.d.ts');
      expect(VALIDATOR_DTS).to.satisfy(
        (value: string) => value.startsWith(`/// <reference path="chalk.d.ts" />`),
        'Expected validator.d.ts to contain a triple-slash reference',
      );
    });
  });

  describe(`src/chalk.d.ts`, () => {
    let CHALK_DTS;
    before(() => {
      CHALK_DTS = fs.readFileSync(path.resolve(__dirname, '..', 'dist', 'chalk.d.ts'), 'utf-8');
    });

    it(`should exist in 'dist' folder`, () => {
      expect(CHALK_DTS).to.be.ok;
    });
  });

  describe(`src/nested/reference/mocked.d.ts`, () => {
    let MOCKED_DTS;
    before(() => {
      MOCKED_DTS = fs.readFileSync(path.resolve(__dirname, '..', 'dist', 'nested/reference/mocked.d.ts'), 'utf-8');
    });

    it(`should exist in 'dist' folder`, () => {
      expect(MOCKED_DTS).to.be.ok;
    });
  });
});
