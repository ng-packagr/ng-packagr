import { tags } from '@angular-devkit/core';
import { expect } from 'chai';
import * as ts from 'typescript';
import { analyseDependencies, DependencyAnalyser } from './analyse-dependencies-transformer';
import { createSourceFile, createSourceText } from '../../testing/typescript.testing';

describe(`analyseDependencies()`, () => {
  it('should detect imported dependencies', () => {
    const fooSourceFile = createSourceFile(
      createSourceText`
        import { CommonModule } from '@angular/common';
        import { NgModule } from '@angular/core';

        import { SecondaryModule } from '@foo/secondary';

        import { SomeComponent } from './some.component';

        @NgModule({
          imports: [
            CommonModule,
            SecondaryModule
          ],
          declarations: [SomeComponent],
          exports: [SomeComponent]
        })
        export class FooModule { }
        `,
      '/foo-bar/foo.module.ts'
    );

    const dependencies = [];

    const analyser: DependencyAnalyser = (sourceFile, moduleId) => {
      dependencies.push(moduleId);
    };

    const fooSourceTransformed = ts.transform(fooSourceFile, [analyseDependencies(analyser)]);

    expect(dependencies).to.deep.equal(['@angular/common', '@angular/core', '@foo/secondary', './some.component']);
  });

  it('should detect exported imports', () => {
    const fooSourceFile = createSourceFile(
      createSourceText`
        export * from '@foo';
        export * from '@foo/secondary';
        `,
      '/foo-bar/public-api.ts'
    );

    const dependencies = [];

    const analyser: DependencyAnalyser = (sourceFile, moduleId) => {
      dependencies.push(moduleId);
    };

    const fooSourceTransformed = ts.transform(fooSourceFile, [analyseDependencies(analyser)]);

    expect(dependencies).to.deep.equal(['@foo', '@foo/secondary']);
  });
});
