import Ajv, { ErrorObject, ValidateFunction } from 'ajv';
import { NgPackageConfig } from '../../ng-package.schema';
import * as log from '../utils/log';

/** Lazily initialized ajv validator instance. */
let ajvValidator: ValidateFunction | null = null;

/**
 * Validates the `ngPackageJson` value against the JSON schema using ajv. An error is thrown if
 * schema errors are found.
 *
 * @param ngPackageJson The value to validate.
 */
export function validateNgPackageSchema(ngPackageJson: unknown): asserts ngPackageJson is NgPackageConfig {
  const validate = getNgPackageSchemaValidator();
  const isValid = validate(ngPackageJson);
  if (!isValid) {
    throw new Error(
      `Configuration doesn't match the required schema.\n${formatSchemaValidationErrors(validate.errors)}`,
    );
  }
}

function formatSchemaValidationErrors(errors: ErrorObject[]): string {
  return errors
    .map(err => {
      let message = `Data path ${JSON.stringify(err.instancePath)} ${err.message}`;
      if (err.keyword === 'additionalProperties') {
        message += ` (${(err.params as any).additionalProperty})`;
      }

      return message + '.';
    })
    .join('\n');
}

/**
 * Returns an initialized ajv validator for the ng-package JSON schema.
 */
function getNgPackageSchemaValidator(): ValidateFunction {
  if (ajvValidator !== null) {
    return ajvValidator;
  }

  const _ajv = new Ajv({
    useDefaults: true,
    strict: false, // strict mode is enabled by default in JSON schema type definitions, which disallows the use of `useDefaults`.
  });

  // Add handler for x-deprecated fields
  _ajv.addKeyword({
    keyword: 'x-deprecated',
    validate: (schema, _data, _parentSchema, dataCxt) => {
      if (schema) {
        log.warn(
          `Option "${dataCxt.parentDataProperty}" is deprecated${typeof schema == 'string' ? ': ' + schema : '.'}`,
        );
      }

      return true;
    },
    errors: false,
  });

  const ngPackageSchemaJson = require('../../ng-package.schema.json');
  ajvValidator = _ajv.compile(ngPackageSchemaJson);

  return ajvValidator;
}
