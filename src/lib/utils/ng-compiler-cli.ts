export async function ngCompilerCli(): Promise<typeof import('@angular/compiler-cli')> {
  // This uses a dynamic import to load `@angular/compiler-cli` which may be ESM.
  // CommonJS code can load ESM code via a dynamic import. Unfortunately, TypeScript
  // will currently, unconditionally downlevel dynamic import into a require call.
  // require calls cannot load ESM code and will result in a runtime error. To workaround
  // this, a Function constructor is used to prevent TypeScript from changing the dynamic import.
  // Once TypeScript provides support for keeping the dynamic import this workaround can
  // be dropped.
  const compilerCliModule = await new Function(`return import('@angular/compiler-cli');`)();

  // If it is not ESM then the functions needed will be stored in the `default` property.
  // This conditional can be removed when `@angular/compiler-cli` is ESM only.
  return compilerCliModule.readConfiguration ? compilerCliModule : compilerCliModule.default;
}

export async function ngccCompilerCli(): Promise<typeof import('@angular/compiler-cli/ngcc')> {
  const compilerCliModule = await new Function(`return import('@angular/compiler-cli/ngcc');`)();

  return compilerCliModule.process ? compilerCliModule : compilerCliModule.default;
}
