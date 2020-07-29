import { BiogridAction } from './';

describe('classes', () => {
  test('create a BiogridAction', () => {
    const efficiency = 100;
    const action = new BiogridAction({
      "small-battery": "solar-panel"
    }, efficiency);
    expect(action.getSupplyingPaths()).toEqual({
      "small-battery": "solar-panel"
    });
  });
});
