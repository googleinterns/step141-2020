import { Biogrid } from './';
import { RuralArea } from '../community';
import { Building } from '../building';
import { GRID_ITEM_NAMES, BUILDING } from '../config';
import { BioBrain } from '../biobrain';

let grid: Biogrid;
let brain: BioBrain;
const name1 = `${GRID_ITEM_NAMES.ENERGY_USER}-1`;
const name2 = `${GRID_ITEM_NAMES.ENERGY_USER}-2`;
const name3 = `${GRID_ITEM_NAMES.ENERGY_USER}-3`;
const name4 = `${GRID_ITEM_NAMES.ENERGY_USER}-4`;
const name5 = `${GRID_ITEM_NAMES.ENERGY_USER}-5`;

beforeAll(() => {
  brain = BioBrain.Instance;
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
   * The small batteries are the s. The larger are the L. The energy source is E
   * _____________
   * |  s     s  |
   * |     E     |
   * |     L     |
   * |           |
   * |  s  E  s  |
   * |           |
   * |     E     |
   * |     L     |
   * |  s     s  |
   * |     E     |
   * ------------
   */

  test('space out the batteries of a new biogrid evenly', () => {
    const gridTemp = new Biogrid(
      new RuralArea([], /* townWidth = */ 10, /* townHeight = */ 10),
      {
        numberOfLargeBatteryCells: 2,
        numberOfSmallBatteryCells: 6,
        numberOfSolarPanels: 4,
      }
    );
    const positions = gridTemp.getSystemState().getAllPositions();
    // +1 to the expected positions because of the grid which is automatically added at position (0, 0)
    expect(positions.length).toEqual(2 + 6 + 4 + 1);
    expect(positions).toEqual([
      { x: 0, y: 0 },
      { x: 5, y: 0.8333333333333333 },
      { x: 5, y: 2.5 },
      { x: 5, y: 4.166666666666667 },
      { x: 5, y: 5.833333333333334 },
      { x: 5, y: 7.5 },
      { x: 5, y: 9.166666666666666 },
      { x: 5, y: 2.5 },
      { x: 5, y: 7.5 },
      { x: 5, y: 1.25 },
      { x: 5, y: 3.75 },
      { x: 5, y: 6.25 },
      { x: 5, y: 8.75 },
    ]);
  });

  test('ensure that the Biogrid take action works', () => {
    // Expect the two buildings to be at maxCapacity
    const expected = [BUILDING.MAX_CAPACITY, BUILDING.MAX_CAPACITY];
    const action = brain.computeAction(grid.getSystemState());
    // Ensure that take action returned
    // There are two non full buildings, and the battery has to be refilled however
    // the components are placed on the grid randomly thus we cannot guarantee the battery is refilled
    // Energy may come from the solar panels but two buildings must be refiled
    expect(Object.keys(action.getSupplyingPaths()).length).toBeGreaterThanOrEqual(2);

    const gridTakeAction = grid.takeAction(action);
    // Make sure that the old grid and new grid are different after dispersion of emergy
    // Check to make sure that the houses have been refiled
    const building2 = gridTakeAction.getGridItem(name2) as Building;
    const building4 = gridTakeAction.getGridItem(name4) as Building;
    const actual = [building2.getEnergyInJoules(), building4.getEnergyInJoules()]
    expect(actual).toEqual(expected);
  });
});
