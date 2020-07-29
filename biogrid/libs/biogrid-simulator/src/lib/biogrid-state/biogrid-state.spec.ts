import { BiogridState } from './';
import { StateGraphVertex, GridItem } from '@biogrid/grid-simulator';
import { Building, BuildingParams } from '../building';
import { GRID_ITEM_NAMES, RESISTANCE } from '../config';
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

  const building1 = new Building({energy: 32, x: 3, y: 4, gridItemName: name1} as BuildingParams);
  const building2 = new Building({energy: 32, x: 7, y: 9, gridItemName: name2} as BuildingParams);
  const building3 = new Building({energy: 32, x: 7, y: 8, gridItemName: name3} as BuildingParams);
  const building4 = new Building({energy: 32, x: 2, y: 1, gridItemName: name4} as BuildingParams);
  const building5 = new Building({energy: 32, x: 9, y: 9, gridItemName: name5} as BuildingParams);

  const townSize = { height: 30, width: 30 };

  const grid: GridItem = {
    gridItemName: GRID_ITEM_NAMES.GRID,
    gridItemResistance: RESISTANCE.GRID,
    getRelativePosition() {
      return { x: Math.floor(townSize.width / 2), y: Math.floor(townSize.height / 2) };
    },
  };



  test('to create a BiogridState', () => {
    const newVertices: StateGraphVertex[] = [
      new Building({energy: 32, x: x1, y: y1, gridItemName: name1} as BuildingParams),
      new Building({energy: 32, x: x2, y: y2, gridItemName: name2} as BuildingParams),
    ];
    
    const state = new BiogridState(newVertices, townSize);
    const graph = state.getGraph();
    // +1 to the expected vertices because of the grid which is automatically added
    expect(state.getAllVertices().length).toEqual(newVertices.length + 1);
    expect(graph.outEdges(name1)).toEqual([{v: name1, w: name2} as Edge]);
    // Expect another inEdge from the grid to the building
    expect(graph.inEdges(name1)).toEqual([{v: grid.gridItemName, w: name1} as Edge, { v: name2, w: name1} as Edge]);
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
    expectedGraph.setNode(grid.gridItemName, grid);
    newVertices.map(vertex => expectedGraph.setNode(vertex.gridItemName, vertex));
    // Add all possible edges
    // Add edges to the graph connecting the grid to the building
    newVertices.map(vertex => expectedGraph.setEdge(grid.gridItemName, vertex.gridItemName, calculateDistance(grid, vertex)));
    // Add edges to the graph connecting the building to the other, and vice versa i.e A to B, B to A
    for (let i = 0; i < newVertices.length; i++) {
      for (let j = i + 1; j < newVertices.length; j++) {
        expectedGraph.setEdge(
          newVertices[i].gridItemName,
          newVertices[j].gridItemName,
          calculateDistance(newVertices[i], newVertices[j])
        );
        expectedGraph.setEdge(
          newVertices[j].gridItemName,
          newVertices[i].gridItemName,
          calculateDistance(newVertices[j], newVertices[i])
        );
      }
    }
    const expectedShortestdistances = alg.dijkstraAll(expectedGraph, getWeights(expectedGraph));

    // Create a graph from the system
    const state = new BiogridState(newVertices, townSize);
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
      new Building({energy: 32, x: 3, y: 4, gridItemName: name1} as BuildingParams),
      new Building({energy: 32, x: 7, y: 9, gridItemName: name2} as BuildingParams),
    ];
    const state = new BiogridState(newVertices, townSize);
    const positions = state.getAllPositions();
    // +1 to the expected vertices because of the grid which is automatically added
    expect(positions.length).toEqual(newVertices.length + 1);
    // index 0 contains the grid
    expect(positions[0].x).toEqual(Math.floor(townSize.width / 2));
    expect(positions[0].y).toEqual(Math.floor(townSize.height / 2));
    expect(positions[1].x).toEqual(3);
    expect(positions[1].y).toEqual(4);
    expect(positions[2].x).toEqual(7);
    expect(positions[2].y).toEqual(9);
  });
});

function calculateDistance(v1: StateGraphVertex, v2: StateGraphVertex) {
  return Math.sqrt(
    Math.pow(v1.getRelativePosition().x - v2.getRelativePosition().x, 2) +
      Math.pow(v1.getRelativePosition().y - v2.getRelativePosition().y, 2)
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
