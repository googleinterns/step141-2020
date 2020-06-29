import * as jsgraphs from 'js-graph-algorithms';
import { Distance } from '../measurements';

export type StateGraphVertex = unknown;

// TODO put in when Batteries, houses, and energy suppliers are put in
export interface NewStateGraphVertex {
  edges?: StateGraphEdge[];
  vertex: StateGraphVertex;
}

export interface StateGraphEdge {
  toIndex: number;
  weight: number;
  label?: string;
}

export interface StateGraph {
  graphIndexToVertex: StateGraphVertex[];
  getGraph: () => jsgraphs.WeightedDiGraph
}
