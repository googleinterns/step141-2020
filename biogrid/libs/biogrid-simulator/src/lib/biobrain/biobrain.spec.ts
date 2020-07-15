import { BioBrain } from "./";
import { BiogridState } from '../biogrid-state'

let actualBrain: BioBrain;

beforeAll(() => {
  actualBrain = BioBrain.Instance;
});

describe('BioBrain class', () => {
  test('computeAction return biogridstate', () => {
    // TODO add assertions for acions
    const action = actualBrain.computeAction(new BiogridState([]))
    expect(action.getSwitchedOnBatteries().length).toBeGreaterThanOrEqual(0);
  });
});
