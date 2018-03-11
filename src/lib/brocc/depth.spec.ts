import { expect } from 'chai';
import { DepthBuilder } from './depth';

describe(`DepthBuilder`, () => {
  it(`should group a->b, a->c`, () => {
    const builder = new DepthBuilder();
    builder.add('a', ['b']);
    builder.add('a', ['c']);

    const groups = builder.build();
    expect(groups[0][0]).to.equal('b');
    expect(groups[0][1]).to.equal('c');
    expect(groups[1][0]).to.equal('a');
  });

  it(`should group a->b, a->c, b->c`, () => {
    const builder = new DepthBuilder();
    builder.add('a', ['b', 'c']);
    builder.add('b', ['c']);

    const groups = builder.build();
    expect(groups[0][0]).to.equal('c');
    expect(groups[1][0]).to.equal('b');
    expect(groups[2][0]).to.equal('a');
  });

  /*
   * This scenario is also visually documented:
   *  - [Dependencies](docs/graph/depth-graph.png)
   *  - [Build Groups](docs/graph/depth-groups.png)
   */
  it(`should group a complex scenario`, () => {
    const builder = new DepthBuilder();
    builder.add('a', ['b', 'c', 'f']);
    builder.add('b', 'c');
    builder.add('c', 'e');
    builder.add('d');
    builder.add('e', 'g');
    builder.add('f', 'g');
    builder.add('h', 'i');
    builder.add('h', 'j');

    const groups = builder.build();
    expect(groups.length).to.equal(5);
    expect(groups[0]).to.have.same.members(['d', 'g', 'i', 'j']);
    expect(groups[1]).to.have.same.members(['e', 'f', 'h']);
    expect(groups[2]).to.have.same.members(['c']);
    expect(groups[3]).to.have.same.members(['b']);
    expect(groups[4]).to.have.same.members(['a']);
  });
});
