import { Biogrid } from './';
import { RuralArea } from '../community';
import { Building } from '../building';
import { GRID_ITEM_NAMES, BUILDING } from '../config';
import { BioBrain } from '../biobrain';

let grid: Biogrid;
let brain: BioBrain;

beforeAll(() => {
  brain = BioBrain.Instance;
  const name1 = `${GRID_ITEM_NAMES.ENERGY_USER}-1`;
  const name2 = `${GRID_ITEM_NAMES.ENERGY_USER}-2`;
  const name3 = `${GRID_ITEM_NAMES.ENERGY_USER}-3`;
  const name4 = `${GRID_ITEM_NAMES.ENERGY_USER}-4`;
  const name5 = `${GRID_ITEM_NAMES.ENERGY_USER}-5`;
  const ruralArea = [
    new Building(BUILDING.DEFAULT_INITIAL_ENERGY, 3, 4, name1),
    new Building(0, 7, 9, name2),
    new Building(BUILDING.DEFAULT_INITIAL_ENERGY, 7, 8, name3),
    new Building(0, 2, 1, name4),
    new Building(BUILDING.DEFAULT_INITIAL_ENERGY, 9, 9, name5),
  ];
  grid = new Biogrid(
    new RuralArea(ruralArea, /* townWidth = */ 10, /* townHeight = */ 10),
    {
      numberOfLargeBatteryCells: 1,
      numberOfSmallBatteryCells: 0,
      numberOfSolarPanels: 1,
    }
  );
});

describe('classes', () => {
  test('create a Biogrid and make sure that the setup algorithm works', () => {
    // TODO add in a test which mimics the algorithm once it is implemented
    const state = grid.getSystemState();

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
  test('space out the batteries of a new biogrid evenly', () => {
    const gridTemp = new Biogrid(
      new RuralArea([], /* townWidth = */ 10, /* townHeight = */ 10),
      {
        numberOfLargeBatteryCells: 5,
        numberOfSmallBatteryCells: 20,
        numberOfSolarPanels: 30,
      }
    );
    const positions = gridTemp.getSystemState().getAllPositions();
    // +1 to the expected positions because of the grid which is automatically added at position (0, 0)
    expect(positions.length).toEqual(5 + 20 + 30 + 1);
  });

  test('ensure that the Biogrid take action works', () => {
    const expected = grid.getSystemState().getAllGridItems();
    const action = brain.computeAction(grid.getSystemState());
    const actual = grid.takeAction(action).getAllGridItems();
    // Ensure that take action returned
    // There are two non full buildings, and the battery has to be refilled as well
    expect(Object.keys(action).length).toBeLessThanOrEqual(3);
    expect(expected).toBeTruthy();
  });
});
