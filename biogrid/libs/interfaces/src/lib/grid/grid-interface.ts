import { State } from '../state';
import { GridAction } from '../grid-action';

export interface Grid {
  getSystemState: () => State;
  takeAction: (action: GridAction) => void;
}
