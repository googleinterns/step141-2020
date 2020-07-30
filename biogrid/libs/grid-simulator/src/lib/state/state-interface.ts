import { Graph, Edge, Path } from 'graphlib';
import { GridItem } from '../grid-item';
import { ItemPosition, Distance, Power } from '../measurements';

export type StateGraphVertex = GridItem;

// TODO put in when Batteries, houses, and energy suppliers are put in
export interface NewStateGraphVertex {
  edges: StateGraphEdge[];
  vertex: StateGraphVertex;
}

export interface StateGraphEdge {
  v: string;
  w: string;
  weight: number;
}

export interface StateGraph {
  resetPowerOnEdges: () => void;
  getAllPositions: () => ItemPosition[];
  getGridItem: (gridItemName: string) => GridItem;
  getGraph: () => Graph;
  getJsonGraph: () => any;
  cloneStateGraph(): Graph;
  getAllVertices: () => string[];
  getShortestDistances: () => { [source: string]: { [node: string]: Path } };
  setPowerBetweenNodes: (v: string, w: string, power: Power) => void;
  getWeightEdge: (edge: Edge) => Distance;
}
