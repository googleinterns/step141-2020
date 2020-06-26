import { Distance } from '../measurements';

// TODO put in when Batteries, houses, and energy suppliers are put in
type GraphVertex = unknown

interface GraphEdge<VertexType> {
  distance: Distance;
  to: VertexType;
  from: VertexType;
  directed?: boolean;
}

export interface StateGraph {
  adjList: Map<GraphVertex, GraphEdge<GraphVertex>>;
}
