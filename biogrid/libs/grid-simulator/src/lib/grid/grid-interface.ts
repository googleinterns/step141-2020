import { StateGraph } from '../state';
import { GridAction } from '../grid-action';

export interface GridOptions {
  [key: string]: unknown;
}

// TODO add in town interface
export interface Grid {
  getSystemState: () => StateGraph;
  takeAction: (action: GridAction) => void;
  updateEnergyUsage: (date: Date) => void;
}
