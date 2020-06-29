import { Biogrid } from './';
import { BiogridAction } from '../biogrid-action';

let grid: Biogrid

beforeAll(() => {
  grid = new Biogrid('Fake town', {
    numberOfLargeBatteryCells: 10,
    numberOfSmallBatteryCells: 10,
  });
});

describe('classes', () => {
  it('should create a Biogrid and make sure that the setup algorithm works', () => {
    // TODO add in a test which mimics the algorithm once it is implemented
    expect(grid.getSystemState()).toBeTruthy();
  });

  it('should ensure that the Biogrid take action works', () => {
    const action = new BiogridAction([])
    expect(grid.takeAction(action)).toReturn();
    const state = grid.getSystemState();
    // TODO add in the test to ensure that the grid action works
    expect(state).toBeTruthy();
  });
});
