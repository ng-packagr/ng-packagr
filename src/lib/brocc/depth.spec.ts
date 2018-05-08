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
    expect(groups.length).to.equal(6);
    expect(groups[0]).to.have.same.members(['d', 'g', 'i', 'j']);
    expect(groups[1]).to.have.same.members(['e', 'f', 'h']);
    expect(groups[2]).to.have.same.members(['c']);
    expect(groups[3]).to.have.same.members(['b']);
    expect(groups[4]).to.have.same.members(['a']);
  });

  /**
   * This scenario is visually documented:
   * https://mermaidjs.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbmIgLS0-IGRcbmIgLS0-IGNcbmIgLS0-IGVcbmEgLS0-IGJcbmEgLS0-IGRcbmEgLS0-IGNcbmEgLS0-IGVcbmQgLS0-IGVcbmMgLS0-IGRcbmMgLS0-IGUiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9fQ
   */
  it(`should group an unordered complex scenario`, () => {
    const builder = new DepthBuilder();
    builder.add('b', ['d','c','e']);
    builder.add('a', ['b', 'd', 'c', 'e']);
    builder.add('d','e');
    builder.add('c', ['d','e']);
    builder.add('e');

    const groups = builder.build();
    expect(groups.length).to.equal(5);
    expect(groups[0]).to.have.same.members(['e']);
    expect(groups[1]).to.have.same.members(['d']);
    expect(groups[2]).to.have.same.members(['c']);
    expect(groups[3]).to.have.same.members(['b']);
    expect(groups[4]).to.have.same.members(['a']);
  });
});
