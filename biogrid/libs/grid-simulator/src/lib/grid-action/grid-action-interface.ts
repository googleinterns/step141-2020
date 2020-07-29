
//TODO add proper interfaces for batteries once created
// Createas a path/edge of the graph which shows where to supply energy and from where
// { supplyTo: supplyFrom}
// supplyTo and supplyFrom are names of gridItems
export interface SupplyingPath {
  [string: string]: string;
}

export interface GridAction {
  getSupplyingPaths: () => SupplyingPath;
  getEfficiency: () => number;
}
