import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
const BASE = path.resolve(__dirname, '..', 'dist');

describe(`@sample/core`, () => {
  const PACKAGE = JSON.parse(fs.readFileSync(`${BASE}/package.json`, 'utf-8'));
  const METADATA = JSON.parse(fs.readFileSync(`${BASE}/core.metadata.json`, 'utf-8'));
  const TYPINGS = fs.readFileSync(`${BASE}/core.d.ts`, 'utf-8');

  describe(`package.json`, () => {

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });
  });

  describe(`core.metadata.json`, () => {

    it(`should exist`, () => {
      expect(METADATA).to.be.ok;
    });

    it(`should be '"__symbolic": "module"'`, () => {
      expect(METADATA['__symbolic']).to.equal('module');
    });

    it(`should '"importAs": "@sample/core"'`, () => {
      expect(METADATA['importAs']).to.equal('@sample/core');
    });

    it(`should have '"__symbolic": "reference"' for 'peerDependencies' modules`, () => {
      const cmp = METADATA['metadata']['AngularComponent']['decorators'][0]['expression'];
      expect(cmp['__symbolic']).to.equal('reference');
      expect(cmp['module']).to.equal('@angular/core');
      expect(cmp['name']).to.equal('Component');

      const dir = METADATA['metadata']['AngularDirective']['decorators'][0]['expression'];
      expect(dir['__symbolic']).to.equal('reference');
      expect(dir['module']).to.equal('@angular/core');
      expect(dir['name']).to.equal('Directive');

      const ngmodule = METADATA['metadata']['AngularModule']['decorators'][0]['expression'];
      expect(ngmodule['__symbolic']).to.equal('reference');
      expect(ngmodule['module']).to.equal('@angular/core');
      expect(ngmodule['name']).to.equal('NgModule');
      const imported = METADATA['metadata']['AngularModule']['decorators'][0]['arguments'][0]['imports'][0];
      expect(imported['__symbolic']).to.equal('reference');
      expect(imported['module']).to.equal('@angular/common');
      expect(imported['name']).to.equal('CommonModule');

      const pipe = METADATA['metadata']['AngularPipe']['decorators'][0]['expression'];
      expect(pipe['__symbolic']).to.equal('reference');
      expect(pipe['module']).to.equal('@angular/core');
      expect(pipe['name']).to.equal('Pipe');

      const service = METADATA['metadata']['AngularService']['decorators'][0]['expression'];
      expect(service['__symbolic']).to.equal('reference');
      expect(service['module']).to.equal('@angular/core');
      expect(service['name']).to.equal('Injectable');
      const deps = METADATA['metadata']['AngularService']['members']['__ctor__'][0]['parameters'][0];
      expect(deps['__symbolic']).to.equal('reference');
      expect(deps['module']).to.equal('@angular/http');
      expect(deps['name']).to.equal('Http');
    });
  });

  describe(`core.d.ts`, () => {

    it(`should exist`, () => {
      expect(TYPINGS).to.be.ok;
    });
  });

});
