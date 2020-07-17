import { Biogrid } from './';
import { BiogridAction } from '../biogrid-action';
import { RuralArea } from '../community';

let grid: Biogrid;

beforeAll(() => {
  grid = new Biogrid(new RuralArea([], 10, 10), {
    numberOfLargeBatteryCells: 10,
    numberOfSmallBatteryCells: 10,
  });
});

describe('classes', () => {
  test('create a Biogrid and make sure that the setup algorithm works', () => {
    // TODO add in a test which mimics the algorithm once it is implemented
    expect(grid.getSystemState()).toBeTruthy();
  });

  test("Biogrid take action changes the grid's state", () => {
    const action = new BiogridAction([]);
    // Ensure that take action returned
    expect(grid.takeAction(action)).toEqual(undefined);
    const state = grid.getSystemState();
    // TODO add in the test to ensure that the grid action works
    expect(state).toBeTruthy();
  });
});
