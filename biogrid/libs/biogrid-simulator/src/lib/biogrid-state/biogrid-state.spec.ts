import { BiogridState } from './';
import { StateGraphVertex, GridItem } from '@biogrid/grid-simulator';
import { Building } from '../building';
import { GRID_ITEM_NAMES } from '../config';
import { Edge, Graph, alg } from "graphlib";

describe('classes', () => {
  const x1 = 10,
    y1 = 5;
  const x2 = 7,
    y2 = 9;

  const name1 = `${GRID_ITEM_NAMES.ENERGY_USER}-1`;
  const name2 = `${GRID_ITEM_NAMES.ENERGY_USER}-2`;
  const name3 = `${GRID_ITEM_NAMES.ENERGY_USER}-3`;
  const name4 = `${GRID_ITEM_NAMES.ENERGY_USER}-4`;
  const name5 = `${GRID_ITEM_NAMES.ENERGY_USER}-5`;

  const building1 = new Building(32, 3, 4, name1);
  const building2 = new Building(32, 7, 9, name2);
  const building3 = new Building(32, 7, 8, name3);
  const building4 = new Building(32, 2, 1, name4);
  const building5 = new Building(32, 9, 9, name5);

  const grid: GridItem = {
    name: GRID_ITEM_NAMES.GRID,
    getPosition() {
      return { x: 0, y: 0 };
    },
  };
  
  test('to create a BiogridState', () => {
    const newVertices: StateGraphVertex[] = [
      new Building(32, x1, y1, name1),
      new Building(32, x2, y2, name2),
    ];
    const state = new BiogridState(newVertices);
    const graph = state.getGraph();
    // +1 to the expected vertices because of the grid which is automatically added
    expect(state.getAllVertices().length).toEqual(newVertices.length + 1);
    expect(graph.outEdges(name1)).toEqual([{v: name1, w: name2} as Edge]);
    // Expect another inEdge from the grid to the building
    expect(graph.inEdges(name1)).toEqual([{v: grid.name, w: name1} as Edge, { v: name2, w: name1} as Edge]);
  });

  test('verify the shortest distances are correct', () => {
    const newVertices: StateGraphVertex[] = [
      building1,
      building2,
      building3,
      building4,
      building5,
    ];
    const expectedGraph = new Graph();
    expectedGraph.setNode(grid.name, grid);
    newVertices.map(vertex => expectedGraph.setNode(vertex.name, vertex));
    // Add all possible edges
    // Add edges to the graph connecting the grid to the building
    newVertices.map(vertex => expectedGraph.setEdge(grid.name, vertex.name, calculateDistance(grid, vertex)));
    // Add edges to the graph connecting the building to the other, and vice versa i.e A to B, B to A
    for (let i = 0; i < newVertices.length; i++) {
      for (let j = i + 1; j < newVertices.length; j++) {
        expectedGraph.setEdge(newVertices[i].name, newVertices[j].name, calculateDistance(newVertices[i], newVertices[j]));
        expectedGraph.setEdge(newVertices[j].name, newVertices[i].name, calculateDistance(newVertices[j], newVertices[i]));
      }
    }
    const expectedShortestdistances = alg.dijkstraAll(expectedGraph, getWeights(expectedGraph));
    
    // Create a graph from the system
    const state = new BiogridState(newVertices);
    const actualShortestDistances = state.getShortestDistances();

    // The expected vertices of the graphs must be the same
    expect(state.getAllVertices().length).toEqual(expectedGraph.nodes().length);

    // The expected object return from the shortest distances must be the same
    expect(Object.keys(actualShortestDistances).length).toEqual(Object.keys(expectedShortestdistances).length);
    expect(actualShortestDistances).toEqual(expectedShortestdistances);

    // Check the shortest distances and verify that they are correct
    for (const source of Object.keys(actualShortestDistances)) {
      for(const dest of Object.keys(actualShortestDistances[source])) {
        expect(
          actualShortestDistances[source][dest].distance
        ).toEqual(
          expectedShortestdistances[source][dest].distance
        );
      }
    }
  });

  test('getAllPositions returns the correct grid item positions', () => {
    const newVertices: StateGraphVertex[] = [
      new Building(/* energy = */ 32, /* x = */ 3, /* y = */ 4, name1),
      new Building(32, 7, 9, name2),
    ];
    const state = new BiogridState(newVertices);
    const positions = state.getAllPositions();
    // +1 to the expected vertices because of the grid which is automatically added
    expect(positions.length).toEqual(newVertices.length + 1);
    // index 0 contains the grid
    expect(positions[0].x).toEqual(0);
    expect(positions[0].y).toEqual(0);
    expect(positions[1].x).toEqual(3);
    expect(positions[1].y).toEqual(4);
    expect(positions[2].x).toEqual(7);
    expect(positions[2].y).toEqual(9);
  });
});

function calculateDistance(v1: StateGraphVertex, v2: StateGraphVertex) {
  return Math.sqrt(
    Math.pow(v1.getPosition().x - v2.getPosition().x, 2) +
      Math.pow(v1.getPosition().y - v2.getPosition().y, 2)
  );
}

/**
 * Function takes in graph and returns the weights of the edges of the graph
 */
function getWeights(graph: Graph) {
  return function(edge: Edge) {
    return graph.edge(edge);
  }
}
