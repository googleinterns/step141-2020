import { Brain, StateGraph, GridAction } from '@biogrid/grid-simulator';
import { BiogridAction } from '../biogrid-action';

// We can only have one BioBrain per grid
export class BioBrain implements Brain {
  private static instance: BioBrain;
  private constructor() {}

  static get Instance(): BioBrain {
    if (!this.instance) {
      this.instance = new BioBrain();
    }
    return this.instance;
  }

  computeAction(state: StateGraph): GridAction {
    // TODO add the type of states
    return new BiogridAction([]);
  }
}
