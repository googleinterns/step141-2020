import { BiogridState } from './';
import { StateGraphVertex } from '@biogrid/grid-simulator';
import { Building } from '../building';

describe('classes', () => {
  const x1 = 10,
    y1 = 5;
  const x2 = 7,
    y2 = 9;
  it('should work to create a BiogridState', () => {
    const newVertices: StateGraphVertex[] = [
      new Building(32, x1, y1),
      new Building(32, x2, y2),
    ];
    const state = new BiogridState(2, newVertices);
    const graph = state.getGraph();
    expect(graph.V).toEqual(2);
    expect(graph.adj(1)).toEqual([{ label: '1-to-0', v: 1, w: 0, weight: 5 }]);
  });
});
