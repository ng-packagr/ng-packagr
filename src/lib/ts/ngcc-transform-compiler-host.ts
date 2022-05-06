import ts from 'typescript';
import { NgccProcessor } from '../ngc/ngcc-processor';

export function ngccTransformCompilerHost(
  compilerHost: ts.CompilerHost,
  compilerOptions: ts.CompilerOptions,
  ngccProcessor: NgccProcessor,
  moduleResolutionCache: ts.ModuleResolutionCache,
): ts.CompilerHost {
  return {
    ...compilerHost,
    resolveModuleNames: (moduleNames: string[], containingFile: string) => {
      return moduleNames.map(moduleName => {
        const { resolvedModule } = ts.resolveModuleName(
          moduleName,
          containingFile,
          compilerOptions,
          compilerHost,
          moduleResolutionCache,
        );

        if (resolvedModule) {
          ngccProcessor.processModule(moduleName, resolvedModule);
        }

        return resolvedModule;
      });
    },
    resolveTypeReferenceDirectives: (
      typeReferenceDirectiveNames: string[] | ts.FileReference[],
      containingFile: string,
      redirectedReference?: ts.ResolvedProjectReference,
    ) => {
      return typeReferenceDirectiveNames.map(name => {
        const moduleName = typeof name === 'string' ? name : name.fileName;

        const { resolvedTypeReferenceDirective } = ts.resolveTypeReferenceDirective(
          moduleName,
          containingFile,
          compilerOptions,
          compilerHost,
          redirectedReference,
        );

        if (resolvedTypeReferenceDirective) {
          ngccProcessor.processModule(moduleName, resolvedTypeReferenceDirective);
        }

        return resolvedTypeReferenceDirective;
      });
    },
  };
}
