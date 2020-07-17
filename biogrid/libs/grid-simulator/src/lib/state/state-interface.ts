import { Graph, Edge, Path } from 'graphlib';
import { GridItem } from '../grid-item';
import { ItemPosition, Distance } from '../measurements';

export type StateGraphVertex = GridItem;

// TODO put in when Batteries, houses, and energy suppliers are put in
export interface NewStateGraphVertex {
  edges: StateGraphEdge[];
  vertex: StateGraphVertex;
}

export interface StateGraphEdge {
  v: string,
  w: string,
  weight: number;
}

export interface StateGraph {
  getAllPositions: () => ItemPosition[];
  getGridItem: (name: string) => GridItem;
  getGraph: () => Graph;
  getAllVertices: () => string[];
  getShortestDistances: () => { [source: string]: { [node: string]: Path } };
  getWeightEdge: (edge: Edge) => Distance;
}
