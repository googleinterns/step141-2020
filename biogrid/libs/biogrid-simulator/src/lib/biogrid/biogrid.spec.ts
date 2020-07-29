import { Biogrid } from './';
import { RuralArea } from '../community';
import { Building } from '../building';
import { GRID_ITEM_NAMES, BUILDING, GRID_DISTANCES } from '../config';
import { BioBrain } from '../biobrain';
import { ItemPosition } from '@biogrid/grid-simulator';

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
        numberOfLargeBatteryCells: 1,
        numberOfSmallBatteryCells: 3,
        numberOfSolarPanels: 2,
      }
    );
    const positions = gridTemp.getSystemState().getAllPositions();
    // +1 to the expected positions because of the grid which is automatically added at position (0, 0)
    expect(positions.length).toEqual(2 + 3 + 1 + 1);
    expect(positions).toEqual([
      { x: 0, y: 0 },
      { x: 5, y: 1.5 },
      { x: 5, y: 5 },
      { x: 5, y: 8 },
      { x: 5.5, y: 5 },
      { x: 5, y: 2.5 },
      { x: 5, y: 7.5 },
    ]);
  });

  test("Biogrid works with the brain's compute action", () => {
    // Expect the two buildings to be at maxCapacity
    const expected = [BUILDING.MAX_CAPACITY, BUILDING.MAX_CAPACITY];
    const action = await brain.computeAction(grid.getSystemState());
    // Ensure that take action returned
    // There are two non full buildings, and the battery has to be refilled however
    // the components are placed on the grid randomly thus we cannot guarantee the battery is refilled
    // Energy may come from the solar panels but two buildings must be refiled
    expect(
      Object.keys(action.getSupplyingPaths()).length
    ).toBeGreaterThanOrEqual(2);
  });

  test("takeAction works on a returned brain's action", () => {
    const expected = [BUILDING.MAX_CAPACITY, BUILDING.MAX_CAPACITY];
    const action = brain.computeAction(grid.getSystemState());
    const gridTakeAction = grid.takeAction(action);
    // Make sure that the old grid and new grid are different after dispersion of energy
    // Check to make sure that the houses have been refiled
    const building2 = gridTakeAction.getGridItem(name2) as Building;
    const building4 = gridTakeAction.getGridItem(name4) as Building;

    const actual = [
      building2.getEnergyInJoules(),
      building4.getEnergyInJoules(),
    ];
    expect(actual).toEqual(expected);
  });

  test('new Biogrid does not overlap items', () => {
    const grid = new Biogrid(
      new RuralArea([], /* townWidth = */ 10, /* townHeight = */ 10),
      {
        numberOfLargeBatteryCells: 2,
        numberOfSmallBatteryCells: 6,
        numberOfSolarPanels: 4,
      }
    );
    function posToString(pos: ItemPosition) {
      return `${pos.x}, ${pos.y}`;
    }
    const positions = grid.getSystemState().getAllPositions().map(posToString);
    const distinctPositions = positions.filter(
      (pos, ind) => positions.indexOf(pos) === ind
    );
    expect(distinctPositions.length).toEqual(positions.length);
  });

  test('new Biogrid throws error when it cannot fit all items into the grid', () => {
    expect(
      () =>
        new Biogrid(
          new RuralArea([], /* townWidth = */ 10, /* townHeight = */ 10),
          {
            numberOfLargeBatteryCells: 200,
            numberOfSmallBatteryCells: 600,
            numberOfSolarPanels: 4,
          }
        )
    ).toThrow(
      `There are too many items on the grid. New items could not be placed with a minimum distance of ${GRID_DISTANCES.INCREMENTS_KM} km apart`
    );
  });
});
