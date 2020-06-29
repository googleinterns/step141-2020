import { Brain } from "@biogrid/grid-simulator";

// We can only have one BioBrain per grid
export class BioBrain implements Brain{
  private static instance: BioBrain;
  private states: unknown[] = [];
  private constructor() { }

  static get Instance(): BioBrain {
    if (!this.instance) {
      this.instance = new BioBrain();
    }
    return this.instance
  }

  private set gridStates(states: unknown[]) {
    this.states = states;
  }

  sendAction(states: unknown[]): unknown {
    this.gridStates = states;
    return 'Send power Testing';
  }
}
