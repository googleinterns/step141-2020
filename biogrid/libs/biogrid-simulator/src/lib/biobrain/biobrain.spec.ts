import { BioBrain } from "./";
import { BiogridState } from '../biogrid-state'

let actualBrain: BioBrain;

beforeAll(() => {
  actualBrain = BioBrain.Instance;
});

describe('BioBrain class', () => {
  test('It should test that there is an action sent back', () => {
    // TODO add assertions for acions
    const action = actualBrain.computeAction(new BiogridState(5, []))
    expect(action.getSwitchedOnBatteries().length).toBeGreaterThanOrEqual(0);
  });

});
