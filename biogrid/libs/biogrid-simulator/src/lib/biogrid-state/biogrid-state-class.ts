import * as jsgraphs from 'js-graph-algorithms';
import {
  StateGraphVertex,
  StateGraph,
  StateGraphEdge,
} from '@biogrid/grid-simulator';

export class BiogridState implements StateGraph {
  // Stores the wires which connect each grid item to each other and the distance between them
  graph: jsgraphs.WeightedDiGraph;
  // Because the graph stores numbers as vertices, graphIndexToVertex is needed to
  // convert between a vertex in the graph and the datastructure it represents
  graphIndexToVertex: StateGraphVertex[];

  constructor(vertices: StateGraphVertex[]) {
    this.graph = new jsgraphs.WeightedDiGraph(vertices.length);
    this.graphIndexToVertex = new Array<StateGraphVertex>(vertices.length);
    vertices.forEach((vertex, i) => {
      this.graphIndexToVertex[i] = vertex;
    });
  }

  public getGraph() {
    return this.graph;
  }

  public convertStateGraphToMST() {
    this.graphIndexToVertex.forEach((vertex, i) => {
      this.addCompletelyConnectedVertex(i, vertex);
    });
    this.graph = this.getMinimumSpanningTree( this.graph);
  }

  public getGridItem(ind: number) {
    return this.graphIndexToVertex[ind];
  }

  /**
   * Get all GridItem positions by their index in the graph
   */
  public getAllPositionsByIndex() {
    return this.graphIndexToVertex.map((vertex) => vertex.getRelativePosition());
  }

  /**
   * Take in a vertex and connect it to every other vertex currently present in the grid
   * This is used in the creation of the MST
   */
  private addCompletelyConnectedVertex(
    newVertexIndex: number,
    vertex: StateGraphVertex
  ) {
    const edges: StateGraphEdge[] = [];
    for (let i = 0; i < this.graph.V; i++) {
      if (newVertexIndex !== i) {
        edges.push({
          toIndex: i,
          weight: this.calculateDistance(vertex, this.graphIndexToVertex[i]),
          label: `${newVertexIndex}-to-${i}`,
        });
      }
    }
    this.addAllEdges(newVertexIndex, edges);
  }

  /**
   * Calculate distance via Pythagorean's theorem
   */
  private calculateDistance(v1: StateGraphVertex, v2: StateGraphVertex) {
    return Math.sqrt(
      Math.pow(v1.getRelativePosition().x - v2.getRelativePosition().x, 2) +
        Math.pow(v1.getRelativePosition().y - v2.getRelativePosition().y, 2)
    );
  }

  private getMinimumSpanningTree(
    fullyConnectedGraph: jsgraphs.WeightedDiGraph
  ): jsgraphs.WeightedDiGraph {
    const kruskal = new jsgraphs.KruskalMST(fullyConnectedGraph);
    const mstGraph = new jsgraphs.WeightedDiGraph(fullyConnectedGraph.V);
    kruskal.mst.forEach((edge) => {
      mstGraph.addEdge(edge);
    });
    return mstGraph;
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
