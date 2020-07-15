import { BiogridAction } from './';

describe('classes', () => {
  test('should work to create a BiogridAction', () => {
    const action = new BiogridAction([]);
    expect(action.getSwitchedOnBatteries()).toEqual([]);
  });
});
