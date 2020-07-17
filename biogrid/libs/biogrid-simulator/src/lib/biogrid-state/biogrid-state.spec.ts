import { BiogridState } from './';
import { StateGraphVertex } from '@biogrid/grid-simulator';
import { Building } from '../building';

describe('classes', () => {
  const x1 = 10,
    y1 = 5;
  const x2 = 7,
    y2 = 9;
  test('create a BiogridState by adding in two vertices and creating the graph', () => {
    const newVertices: StateGraphVertex[] = [
      new Building(/* energy= */ 32, x1, y1),
      new Building(/* energy= */ 32, x2, y2),
    ];
    const state = new BiogridState(newVertices);
    const graph = state.getGraph();
    expect(graph.V).toEqual(2);
  });

  test('convertStateGraphToMST should simplify the state graph to a minimum spanning tree', () => {
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
