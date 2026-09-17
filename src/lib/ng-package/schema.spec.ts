import { describe, expect, it } from 'vitest';
import ngPackageSchema from '../../ng-package.schema.json';
import { formatSchemaValidationErrors, getSchemaValidator } from './schema';

describe('formatSchemaValidationErrors', () => {
  const validate = getSchemaValidator(ngPackageSchema);

  function errorsFor(config: unknown): string {
    expect(validate(config)).toBe(false);

    return formatSchemaValidationErrors(validate.errors ?? []);
  }

  it('names an unknown option and the options that are valid there', () => {
    expect(errorsFor({ name: 'my-lib' })).toBe(
      'Unknown option "name". Valid options are: $schema, deleteDestPath, dest, ' +
        'keepLifecycleScripts, allowedNonPeerDependencies, assets, inlineStyleLanguage, lib.',
    );
  });

  it('points at the object an unknown option was found in', () => {
    expect(errorsFor({ lib: { entryFilePath: 'public-api.ts' } })).toBe(
      'Unknown option "entryFilePath" at "/lib". ' +
        'Valid options are: entryFile, flatModuleFile, cssUrl, styleIncludePaths, sass.',
    );
  });

  it('leaves an error that is not about an unknown option alone', () => {
    expect(errorsFor({ dest: 42 })).toBe('Data path "/dest" must be string.');
  });
});
