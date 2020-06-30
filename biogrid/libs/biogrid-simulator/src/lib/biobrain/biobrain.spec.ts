import { BioBrain } from "./";

let actualBrain: BioBrain;

beforeAll(() => {
  actualBrain = BioBrain.Instance;
});

describe('BioBrain class', () => {
  test('It should test that there is only one instance of brain in the system', () => {
    const expectedBrain = BioBrain.Instance;

    expect(actualBrain).toEqual(expectedBrain);
  });

  test('It should test that there is an action sent back', () => {
    // TODO insert the right states
    const states = ['state1', 'state2'];
    const expectedAction = 'Send power Testing';

    const actualAction = actualBrain.sendAction(states);

    expect(actualAction).toEqual(expectedAction);
  });
});