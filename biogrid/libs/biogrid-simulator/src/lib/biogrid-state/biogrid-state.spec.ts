import { BiogridState } from './';
import { NewStateGraphVertex } from '@biogrid/grid-simulator';
import { Building } from '../building';

describe('classes', () => {
  it('should work to create a BiogridState', () => {
    const newVertices: NewStateGraphVertex[] = [
      {
        vertex: new Building(12),
        edges: [
          {
            toIndex: 1,
            weight: 10,
            label: 'v 1 label',
          },
        ],
      },
      {
        vertex: new Building(32),
        edges: [
          {
            toIndex: 0,
            weight: 11,
            label: 'v 2 label',
          },
        ],
      },
    ] as NewStateGraphVertex[];
    const state = new BiogridState(2, newVertices);
    const graph = state.getGraph();
    expect(graph.V).toEqual(2);
    expect(graph.adj(1)).toEqual([
      { label: 'v 2 label', v: 1, w: 0, weight: 11 },
    ]);
  });
});
