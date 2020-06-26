import { StateGraph } from '../state';
import { GridAction } from '../grid-action';

// TODO add in town interface
export interface Grid {
  setupGrid: (town: unknown) => void
  getSystemState: () => StateGraph;
  takeAction: (action: GridAction) => void;
}
