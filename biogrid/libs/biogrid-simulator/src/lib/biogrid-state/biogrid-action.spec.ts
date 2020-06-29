import { BiogridState } from './';

describe('classes', () => {
  it('should work to create a BiogridState', () => {
    const state = new BiogridState(2, [
      {
        vertex: 'v 1',
        edges: {
          toIndex: 1,
          weight: 10,
        },
      },
      {
        vertex: 'v 2',
        edges: {
          toIndex: 0,
          weight: 11,
          label: 'v 2 label'
        },
      },
    ]);
    const graph = state.getGraph()
    expect(graph.componentCount()).toEqual(2);
    expect(graph.V).toEqual(2);
    expect(graph.adj(1)).toEqual(2);

  });
});
