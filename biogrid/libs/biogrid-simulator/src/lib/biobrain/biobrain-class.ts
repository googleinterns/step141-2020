import { Brain } from "@biogrid/grid-simulator";

// We can only have one BioBrain per grid
export class BioBrain implements Brain{
  private static instance: BioBrain;
  // TODO add the type of states
  private states: unknown[] = [];
  private constructor() { }

  static get Instance(): BioBrain {
    if (!this.instance) {
      this.instance = new BioBrain();
    }
    return this.instance
  }

  private set gridStates(states: unknown[]) {
    // TODO add the type of states
    this.states = states;
  }

  sendAction(states: unknown[]): unknown {
    // TODO add the type of states
    this.gridStates = states;
    return 'Send power Testing';
  }
}
