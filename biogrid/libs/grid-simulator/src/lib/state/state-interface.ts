import * as jsgraphs from 'js-graph-algorithms';
import { Battery } from '../battery';
import { EnergyUser } from '../energyuser';
import { EnergySource } from '../energy-source';

export type StateGraphVertex = Battery | EnergyUser | EnergySource;

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
  getGraph: () => jsgraphs.WeightedDiGraph
}
