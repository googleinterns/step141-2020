import { Grid, StateGraph, GridAction } from '@biogrid/grid-simulator'

export class BioGrid implements Grid {
  setupGrid(town: unknown) {
    return;
  }

  getSystemState(): StateGraph {
    const state: StateGraph = {
      adjList: new Map()
    }
    return state
  }

  takeAction(action: GridAction) {
    return;
  }
}
