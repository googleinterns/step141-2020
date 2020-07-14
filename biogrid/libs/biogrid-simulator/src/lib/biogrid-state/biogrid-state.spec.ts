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
    const state = new BiogridState(newVertices);
    const graph = state.getGraph();
    expect(graph.V).toEqual(2);
    expect(graph.adj(1)).toEqual([{ label: '1-to-0', v: 1, w: 0, weight: 5 }]);
  });

  it('should work to simplify the state to a MST', () => {
    const newVertices: StateGraphVertex[] = [
      new Building(32, 3, 4),
      new Building(32, 7, 9),
      new Building(32, 7, 8),
      new Building(32, 2, 1),
      new Building(32, 9, 9),
    ];
    const state = new BiogridState(newVertices);
    state.convertStateGraphToMST();
    expect(state.getGraph().V).toEqual(newVertices.length);
    let totalEdges = 0;
    for (let i = 0; i < newVertices.length; i++) {
      totalEdges += state.getGraph().adj(i).length;
    }
    expect(totalEdges).toEqual(newVertices.length - 1);
  });
});
