import { BiogridAction } from './';

describe('classes', () => {
  test('Create empty BiogridAction', () => {
    const action = new BiogridAction([]);
    expect(action.getSwitchedOnBatteries()).toEqual([]);
  });
});
