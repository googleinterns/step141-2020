import { BioBrain } from "./";
import { Biogrid } from "../biogrid";
import { GRID_ITEM_NAMES, BUILDING } from "../config";
import { Building } from "../building";
import { RuralArea } from "../community";

let actualBrain: BioBrain;
let grid: Biogrid;

beforeAll(() => {
  actualBrain = BioBrain.Instance;
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

describe('BioBrain class', () => {
  test('It should test that there is an action sent back', () => {
    // TODO add assertions for acions
    const action = actualBrain.computeAction(grid.getSystemState());
    expect(Object.keys(action.getSupplyingPaths()).length).toBeGreaterThanOrEqual(0);
  });

});
