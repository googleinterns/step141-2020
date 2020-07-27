import { StateGraph } from '../state';
import { GridAction } from '../grid-action';

export interface Brain {
  computeAction(state: StateGraph): Promise<GridAction>;
}
