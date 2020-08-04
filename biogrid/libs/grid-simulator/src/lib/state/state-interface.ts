/**
 * @file defines @interface StateGraph which defines the graph that holds the gridItems and their states.
 * The vertices of the graph are represented by @typedef StateGraphVertex which is basically @interface GridItem
 * The vertices are connected by @interface StateGraphEdge which holds a start vertex v, destination vertex w, and
 * the distance between the two vertices
 *
 * @summary the file holds an interface for the state graph which contains the different gridItems in the grid and their states
 * @author Lev Stambler <levst@google.com>
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 6/26/2020, 10:20:42 AM
 * Last modified  : 7/28/2020, 4:08:50 PM
 */

import { Graph, Edge, Path } from 'graphlib';
import { GridItem } from '../grid-item';
import { ItemPosition, Distance, Power } from '../measurements';

export type StateGraphVertex = GridItem;

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
