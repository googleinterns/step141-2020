import * as jsgraphs from 'js-graph-algorithms';
import { GridItem } from '../grid-item';
import { ItemPosition } from '../measurements';

export type StateGraphVertex = GridItem;

// TODO put in when Batteries, houses, and energy suppliers are put in
export interface NewStateGraphVertex {
  edges: StateGraphEdge[];
  vertex: StateGraphVertex;
}

export interface StateGraphEdge {
  toIndex: number;
  weight: number;
  label: string;
}

export interface StateGraph {
  graphIndexToVertex: StateGraphVertex[];
  getAllPositionsByIndex: () => ItemPosition[];
  getGridItem: (ind: number) => GridItem;
  getGraph: () => jsgraphs.WeightedDiGraph;
}
