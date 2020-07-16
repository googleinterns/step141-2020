import { Graph, alg, Path, Edge } from "graphlib";
import {
  StateGraphVertex,
  StateGraph,
  StateGraphEdge,
  Distance,
} from '@biogrid/grid-simulator';
import { GridItem } from 'libs/grid-simulator/src/lib/grid-item';
import { GRID_ITEM_NAMES } from '../config';

export class BiogridState implements StateGraph {
  private graph: Graph;

  constructor(vertices: StateGraphVertex[]) {
    // Directed implies that I can have two edges between A and B, but in opposite directions
    this.graph = new Graph({directed: true});

    // Initialize the graph with a grid which is a gridItem and has position (0, 0) to keep track of where the items are placed on the map
    const grid: GridItem = {
      name: GRID_ITEM_NAMES.GRID,
      getPosition() {
        return {x: 0, y: 0};
      }
    }
    this.graph.setNode(grid.name, (grid as GridItem));
    
    // Add all the vertices as nodes/vertices of the graph, with a name for
    // the particular grid item and label which is data for the particular vertex as the GridItem itself
    vertices.map(vertex => this.graph.setNode(vertex.name, (vertex as GridItem)));


    // Add all the edges that can be formed into the graph, read the add method for how it is done
    vertices.map(vertex => this.addEdge(vertex));
    this.graph.edge
  }

  public getGraph() {
    return this.graph;
  }

  /**
   * Method finds all the vertices in the graph and returns tehir names
   * @returns the names of the vertices / gridItems in the grid
   */
  public getAllVertices(): string[] {
    return this.graph.nodes();
  }

  /**
   * Method searches the graph for a specific node by its name
   * @param name is the string that represents the GridItem you are searching for
   */
  public getGridItem(name: string): GridItem {
    return this.graph.node(name);
  }

  /**
   * Method returns the shortest distance from every edge to the all the other edges
   * @returns the shortest distance from any edge to the other edges
   */
  public getShortestDistances():{ [source: string]: { [node: string]: Path } }  {
    return alg.dijkstraAll(this.graph, this.getWeightEdge)
  }

  /**
   * When given a specific edge, return the weight or distance between the two vertices
   * @param edge is the Edge of the graph which you would like to get
   * @returns the weight or the distance between the vertices of @param edge
   */
  public getWeightEdge(edge: Edge): Distance {
    return this.graph.edge(edge);
  }

  /**
   * Get all GridItem positions by their index in the graph
   */
  public getAllPositions() {
    return this.graph.nodes().map(vertex => this.graph.node(vertex).getPosition());
  }

  /**
   * Add Edge when there is supposed to be an edge
   * Add edges from the grid, to the every other part of the grid except solar panels
   * Add reverse edges from the batteries to the grid
   * Add edge from solar panels to the grid, not the reverse
   */
  private addEdge(newVertex: GridItem) {
    const newVertexName = newVertex.name;
    for (const vertex of this.graph.nodes()) {
      const distance = this.calculateDistance(newVertex, this.graph.node(vertex).name)
      let edge: StateGraphEdge;
      // Solar panels to the grid only
      // searching for includes GRID so that when scaling it is easy to add multiple grids
      if (newVertexName.includes(GRID_ITEM_NAMES.SOLAR_PANEL) && vertex.includes(GRID_ITEM_NAMES.GRID)) {
        edge = { edge: {v: newVertexName, w: vertex, name: `${newVertexName}-to-${vertex}`}, weight: distance};
      } else if (newVertexName.includes(GRID_ITEM_NAMES.LARGE_BATTERY) && vertex.includes(GRID_ITEM_NAMES.GRID)) {
        edge = { edge: {v: newVertexName, w: vertex, name: `${newVertexName}-to-${vertex}`}, weight: distance};
        // Add the opposite edge from grid to battery
        this.graph.setEdge(vertex, newVertexName, distance, `${vertex}-to-${newVertexName}`);
      } else if (newVertexName.includes(GRID_ITEM_NAMES.SMALL_BATTERY)) {
        if (vertex.includes(GRID_ITEM_NAMES.GRID)) {
          edge = { edge: {v: newVertexName, w: vertex, name: `${newVertexName}-to-${vertex}`}, weight: distance };
          // Add the opposite edge from grid to battery
          this.graph.setEdge(vertex, newVertexName, distance, `${vertex}-to-${newVertexName}`);
        } else if (vertex.includes(GRID_ITEM_NAMES.ENERGY_USER)) {
          edge = { edge: {v: newVertexName, w: vertex, name: `${newVertexName}-to-${vertex}`}, weight: distance };
        } else {
          continue
        }
      } else if (newVertexName.includes(GRID_ITEM_NAMES.ENERGY_USER)) {
        if (newVertexName.includes(GRID_ITEM_NAMES.GRID) || newVertexName.includes(GRID_ITEM_NAMES.SMALL_BATTERY)) {
          edge = {  edge: {v: newVertexName, w: vertex, name: `${vertex}-to-${newVertex}`}, weight: distance }
        } else if (vertex.includes(GRID_ITEM_NAMES.ENERGY_USER)) {
            edge = { edge: {v: newVertexName, w: vertex, name: `${newVertexName}-to-${vertex}`}, weight: distance };
            // Add the reverse edge from the new energy user/ building to the other building
            this.graph.setEdge(vertex, newVertexName, distance, `${vertex}-to-${newVertexName}`);
        } else {
          continue;
        }
      } else {
        // Do not connect the parts of the grid which don't have to be connected
        continue;
      }
      this.graph.setEdge(edge.edge, edge.weight);
    }
  }

  /**
   * Calculate distance via Pythagorean's theorem
   */
  private calculateDistance(v1: StateGraphVertex, v2: StateGraphVertex) {
    return Math.sqrt(
      Math.pow(v1.getPosition().x - v2.getPosition().x, 2) +
        Math.pow(v1.getPosition().y - v2.getPosition().y, 2)
    );
  }
}
