// NOTE: The '@example/fail-no-such-module' module doesn't exist.
import * as exampleModule from '@example/fail-no-such-module';

export const EXAMPLE_CORE_INSTANCE = exampleModule('no such module');
