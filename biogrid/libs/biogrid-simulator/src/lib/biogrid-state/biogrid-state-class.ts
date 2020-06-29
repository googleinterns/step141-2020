import * as jsgraphs from 'js-graph-algorithms';
import {
  StateGraphVertex,
  NewStateGraphVertex,
  StateGraph,
  StateGraphEdge,
} from '@biogrid/grid-simulator';

export class BiogridState implements StateGraph {
  graph: jsgraphs.WeightedDiGraph;
  graphIndexToVertex: StateGraphVertex[];

  constructor(numberOfVertices: number, vertices: NewStateGraphVertex[]) {
    this.graph = new jsgraphs.WeightedDiGraph(numberOfVertices);
    this.graphIndexToVertex = new Array<StateGraphVertex>(numberOfVertices);
    vertices.forEach((vertex, i) => {
      this.graphIndexToVertex[i] = vertex.vertex;
      this.addAllEdges(i, vertex.edges);
    });
  }

  public getGraph() {
    return this.graph;
  }

  private addAllEdges(vertexIndex: number, edges: StateGraphEdge[]) {
    edges.forEach((edge) => {
      this.graph.addEdge(
        new jsgraphs.Edge(vertexIndex, edge.toIndex, edge.weight)
      );
      (this.graph.edge(vertexIndex, edge.toIndex) as jsgraphs.Edge).label =
        edge.label;
    });
  }
}
