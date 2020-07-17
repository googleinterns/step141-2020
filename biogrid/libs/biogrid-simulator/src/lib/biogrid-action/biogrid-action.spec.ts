import { BiogridAction } from './';

describe('classes', () => {
  test('create a BiogridAction', () => {
    const action = new BiogridAction({
      "small-battery": "solar-panel"
    });
    expect(action.getSupplyingPaths()).toEqual({"small-battery": "solar-panel"});
  });
});
