# Entry Files

## Why?

The entry file is the starting point of a library's public API surface.
All symbols that are exported from the entry file are available to users of the library and should be considered public.
Symbols that are not exported from the entry file should be considered internal.

### Minimal Example

In the `public_api.ts`:

```ts
export { Foo } from './foo';
```

In an app:

```ts
import { Foo } from '@foo/library';
```

## How?

Make sure that the `public_api.ts` contains `export` statements that reference every public thing.

## Internal Things

An internal thing could be a little helper component (or directive, or class, or...) that is used only inside a public component (or directive, or ...).
You should not export these from the `public_api.ts`.

## Angular-specific Recommendations

The general recommendation is:

- export every public Angular module, component, directive, service, pipe from the `public_api.ts`.
- add every public component, directive, and pipe to the `exports: []` metadata of the module.
- add every public service either to the `providers: []` metadata of the module, make it available [through the `forRoot()` pattern](https://angular.io/guide/ngmodule-faq#what-is-the-forroot-method), or use the [`providedIn` syntax](https://angular.io/tutorial/toh-pt4#provide-the-heroservice).

### Why must the TypeScript classes of components, directives, pipes, and services be exported?

The service classes must be exported so that users can inject them like:

```ts
import { LibraryService } from '@foo/library';

class UserComponent {
  constructor(foo: LibraryService) {}
}
```

To use a component (or directive or pipe) in a template, you would not need to export the class from `public_api.ts`.
However, users should be allowed to obtain references, e.g. through `@ContentChild()` or `@ViewChild()`, or to dynamically create a component.
Therefore, the TypeScript classes must be exported.

```ts
import { LibraryDirective } from '@foo/library';

class UserComponent {
  @ViewChild(LibraryDirective} libraryThing: LibraryDirective
}
```

### Example

In the library code, define an Angular module like the following one:

```ts
@NgModule({
  declarations: [ PublicComponent, InternalDirective ],
  exports: [ PublicComponent ]
})
export class FooModule {}
```

In the `public_api.ts` the module and the component should be exported:

```ts
export { FooModule } from './foo.module';
export { PublicComponent }  from './public.component';
```

## Changing the Entry File

> What if I don't like `public_api.ts`?

You can change the entry point file by using the `ngPackage` configuration field in `package.json` (or `ng-package.json`).
For example, the following would use `index.ts` as the entry point:

```json
{
  "ngPackage": {
    "lib": {
      "entryFile": "index.ts"
    }
  }
}
```
