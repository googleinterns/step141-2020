import { Biogrid } from './';
import { BiogridAction } from '../biogrid-action';
import { RuralArea } from '../community';

let grid: Biogrid;

beforeAll(() => {
  grid = new Biogrid(
    new RuralArea([], /* townWidth = */ 10, /* townHeight = */ 10),
    {
      numberOfLargeBatteryCells: 2,
      numberOfSmallBatteryCells: 6,
    }
  );
});

describe('classes', () => {
  test('create a Biogrid and make sure that the setup algorithm works', () => {
    // TODO add in a test which mimics the algorithm once it is implemented
    expect(grid.getSystemState()).toBeTruthy();
  });

  /**
   * The small batteries are the s. THe larger are the L
   * _____________
   * |  s  L  s  |
   * |  s     s  |
   * |  s  L  s  |
   * |  s     s  |
   * |  s  L  s  |
   * |  s     s  |
   * |  s  L  s  |
   * |  s     s  |
   * |  s  L  s  |
   * |  s     s  |
   * ------------
   */
  test('Space out the batteries of a new biogrid evenly', () => {
    const positions = grid.getSystemState().getAllPositionsByIndex();
    expect(positions).toEqual([
      { x: 5, y: 0.8333333333333333 },
      { x: 5, y: 2.5 },
      { x: 5, y: 4.166666666666667 },
      { x: 5, y: 5.833333333333334 },
      { x: 5, y: 7.5 },
      { x: 5, y: 9.166666666666666 },
      { x: 5, y: 2.5 },
      { x: 5, y: 7.5 },
    ]);
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
