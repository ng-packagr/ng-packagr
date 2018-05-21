import { expect } from 'chai';
import { FileCache, DeleteStrategy } from './file-cache';

describe('FileCache', () => {
  let cache: FileCache;

  beforeEach(() => {
    cache = new FileCache();
    cache.getOrCreate('/component/component-primary.ts');
    cache.getOrCreate('/component/component-primary.html');
    cache.getOrCreate('/component/component-primary.scss');
    cache.getOrCreate('/service/component-service.ts');
  });

  it('should return an empty object when file is not found', () => {
    expect(cache.getOrCreate('not-available')).to.ok;
  });

  it(`should delete only a single with default 'DeleteStrategy'`, () => {
    cache.delete('/component/component-primary.scss');
    expect(cache.size()).to.equal(3);
  });

  it(`should delete all similar files when setting 'PartialMatch' as 'DeleteStrategy'`, () => {
    cache.delete('/component', DeleteStrategy.PartialMatch);
    expect(cache.size()).to.equal(1);
    expect(cache.has('/service/component-service.ts')).to.equal(true);
  });
});
