import { Biogrid } from './';
import { BiogridAction } from '../biogrid-action';
import { RuralArea } from '../community';

let grid: Biogrid;

beforeAll(() => {
  grid = new Biogrid(
    new RuralArea([], /* townWidth = */ 10, /* townHeight = */ 10),
    {
      numberOfLargeBatteryCells: 5,
      numberOfSmallBatteryCells: 20,
    }
  );
});

describe('classes', () => {
  test('should create a Biogrid and make sure that the setup algorithm works', () => {
    // TODO add in a test which mimics the algorithm once it is implemented
    expect(grid.getSystemState()).toBeTruthy();
  });

  /**
   * The small batteries are the x. THe larger are the *
   * _____________
   * |  x  *  x  |
   * |  x     x  |
   * |  x  *  x  |
   * |  x     x  |
   * |  x  *  x  |
   * |  x     x  |
   * |  x  *  x  |
   * |  x     x  |
   * |  x  *  x  |
   * |  x     x  |
   * ------------
   */
  test('Space out the batteries of a new biogrid evenly', () => {
    const positions = grid.getSystemState().getAllPositionsByIndex();
    expect(positions).toEqual([
      { x: 2.5, y: 0.5 },
      { x: 7.5, y: 0.5 },
      { x: 2.5, y: 1.5 },
      { x: 7.5, y: 1.5 },
      { x: 2.5, y: 2.5 },
      { x: 7.5, y: 2.5 },
      { x: 2.5, y: 3.5 },
      { x: 7.5, y: 3.5 },
      { x: 2.5, y: 4.5 },
      { x: 7.5, y: 4.5 },
      { x: 2.5, y: 5.5 },
      { x: 7.5, y: 5.5 },
      { x: 2.5, y: 6.5 },
      { x: 7.5, y: 6.5 },
      { x: 2.5, y: 7.5 },
      { x: 7.5, y: 7.5 },
      { x: 2.5, y: 8.5 },
      { x: 7.5, y: 8.5 },
      { x: 2.5, y: 9.5 },
      { x: 7.5, y: 9.5 },
      { x: 5, y: 1 },
      { x: 5, y: 3 },
      { x: 5, y: 5 },
      { x: 5, y: 7 },
      { x: 5, y: 9 },
    ]);
  });

  test('should ensure that the Biogrid take action works', () => {
    const action = new BiogridAction([])
    // Ensure that take action returned
    expect(grid.takeAction(action)).toEqual(undefined);
    const state = grid.getSystemState();
    // TODO add in the test to ensure that the grid action works
    expect(state).toBeTruthy();
  });
});
