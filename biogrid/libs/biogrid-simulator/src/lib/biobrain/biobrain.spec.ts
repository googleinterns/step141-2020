import { BioBrain } from "./";

let actualBrain: BioBrain;

beforeAll(() => {
  actualBrain = BioBrain.Instance;
});

describe('BioBrain class', () => {
  test('It should test that there is only one instance of brain in the system', () => {
    // TODO insert the right states
    const gridStates = ['Grid is fine', 'Source energy is flowing in', 'Battery is not full'];
    // Change the states of the brain and see if any brain instance has the same values
    actualBrain.gridStates = gridStates;
    
    const expectedBrain = BioBrain.Instance.gridStates;
    expect(actualBrain.gridStates).toEqual(expectedBrain);
  });

  test('It should test that there is an action sent back', () => {
    // TODO insert the right states
    const states = ['state1', 'state2'];
    const expectedAction = 'Send power Testing';

    const actualAction = actualBrain.sendAction(states);

    expect(actualAction).toEqual(expectedAction);
  });
});
