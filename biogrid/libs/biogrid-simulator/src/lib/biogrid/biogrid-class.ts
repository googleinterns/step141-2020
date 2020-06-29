import {
  Grid,
  StateGraph,
  GridAction,
  GridOptions,
} from '@biogrid/grid-simulator';
import { BiogridState } from '../biogrid-state';

export interface BiogridOptions extends GridOptions {
  numberOfSmallBatteryCells?: number;
  numberOfLargeBatteryCells?: number;
}

export class BioGrid implements Grid {
  private state: BiogridState;
  constructor(town: unknown, opts?: BiogridOptions) {
    this.state = new BiogridState(10, []);
  }

  getSystemState(): BiogridState {
    return this.state;
  }

  takeAction(action: GridAction) {
    return;
  }
}
