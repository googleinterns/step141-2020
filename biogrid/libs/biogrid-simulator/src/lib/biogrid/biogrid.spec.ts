import { Biogrid } from './';
import { RuralArea } from '../community';
import { Building, BuildingParams } from '../building';
import { GRID_ITEM_NAMES, BUILDING, GRID_DISTANCES } from '../config';
import { BioBrain } from '../biobrain';
import { EnergyUser, GridItem, ItemPosition } from '@biogrid/grid-simulator';

let grid: Biogrid;
let brain: BioBrain;
const name1 = `${GRID_ITEM_NAMES.ENERGY_USER}-1`;
const name2 = `${GRID_ITEM_NAMES.ENERGY_USER}-2`;
const name3 = `${GRID_ITEM_NAMES.ENERGY_USER}-3`;
const name4 = `${GRID_ITEM_NAMES.ENERGY_USER}-4`;
const name5 = `${GRID_ITEM_NAMES.ENERGY_USER}-5`;
const townHeight = 10;
const townWidth = 10;

beforeAll(() => {
  brain = BioBrain.Instance;
  const buildingList = [
    new Building({
      energy: BUILDING.DEFAULT_INITIAL_ENERGY,
      x: 3,
      y: 4,
      gridItemName: name1,
    } as BuildingParams),
    new Building({
      energy: 0,
      x: 7,
      y: 9,
      gridItemName: name2,
    } as BuildingParams),
    new Building({
      energy: BUILDING.DEFAULT_INITIAL_ENERGY,
      x: 7,
      y: 8,
      gridItemName: name3,
    } as BuildingParams),
    new Building({
      energy: 0,
      x: 2,
      y: 1,
      gridItemName: name4,
    } as BuildingParams),
    new Building({
      energy: BUILDING.DEFAULT_INITIAL_ENERGY,
      x: 9,
      y: 9,
      gridItemName: name5,
    } as BuildingParams),
  ];
  grid = new Biogrid(
    new RuralArea(
      buildingList,
      /* townWidth = */ townWidth,
      /* townHeight = */ townHeight
    ),
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
      { x: Math.floor(townWidth / 2), y: Math.floor(townHeight / 2) },
      { x: 5, y: 1.5 },
      { x: 5, y: 5 },
      { x: 5, y: 8 },
      { x: 5.5, y: 5 },
      { x: 5, y: 2.5 },
      { x: 5, y: 7.5 },
    ]);
  });

  test('drainEnergyUser removes energy from all users', async () => {
    const midnight = new Date();
    midnight.setHours(0);
    const state = grid.getSystemState();
    const energyUsers: EnergyUser[] = state
      .getAllVertices()
      .map((vertex: string) => state.getGridItem(vertex))
      .filter((item: GridItem) =>
        item.gridItemName.includes(GRID_ITEM_NAMES.ENERGY_USER)
      ) as EnergyUser[];
    energyUsers.forEach((energyUser) =>
      energyUser.increaseEnergy(/* energy in kilowatts = */ 8)
    );
    const energyBeforeDrain: number[] = energyUsers.map((user) =>
      user.getEnergyInJoules()
    );
    grid.updateEnergyUsage(midnight);
    const energyAfterDrain: number[] = energyUsers.map((user) =>
      user.getEnergyInJoules()
    );
    energyBeforeDrain.forEach((energyIndividualUserBefore, i) => {
      expect(energyIndividualUserBefore).toBeGreaterThan(energyAfterDrain[i]);
    });
  });

  test("Biogrid works with the brain's compute action", async () => {
    // Expect the two buildings to be at maxCapacity
    const expected = [BUILDING.MAX_CAPACITY, BUILDING.MAX_CAPACITY];
    const action = await brain.computeAction(grid.getSystemState());
    // Ensure that take action returned
    // There are two non full buildings, and the battery has to be refilled however
    // the components are placed on the grid randomly thus we cannot guarantee the battery is refilled
    // Energy may come from the solar panels but two buildings must be refiled
    expect(
      Object.keys(action.getSupplyingPaths()).length
    ).toEqual(2);
  });

  test("takeAction works on a returned brain's action", async () => {
    const expected = [BUILDING.MAX_CAPACITY, BUILDING.MAX_CAPACITY];
    const action = await brain.computeAction(grid.getSystemState());
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
      new RuralArea(/* buildings = */ [], /* townWidth = */ 10, /* townHeight = */ 10),
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
          new RuralArea(/* buildings = */ [], /* townWidth = */ 10, /* townHeight = */ 10),
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
