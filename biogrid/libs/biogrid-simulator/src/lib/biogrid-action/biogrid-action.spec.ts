import { BiogridAction } from './';

describe('classes', () => {
  it('should work to create a BiogridAction', () => {
    const action = new BiogridAction({
      "small-battery": "solar-panel"
    });
    expect(action.getSupplyingPaths()).toEqual({"small-battery": "solar-panel"});
  });
});
