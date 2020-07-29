/**
 * @summary defines the unit tests for the @class RuralArea
 * @author Awad Osman <awado@google.com>
 * @author Lev Stambler <levst@google.com>
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 7/1/2020, 5:27:50 PM
 * Last modified  : 7/29/2020, 10:34:24 AM
 */
import { Building, BuildingParams } from '../building';
import { RuralArea } from './';
import { GRID_ITEM_NAMES } from '../config';

describe('tests for RuralArea class', () => {
  const x = 10,
    y = 10;
    const gridItemName = GRID_ITEM_NAMES.ENERGY_USER;
  test('getBuildingById()', () => {
    const buildings: Building[] = [
      new Building({energy: 5, x: 2, y: 3, gridItemName} as BuildingParams),
      new Building({energy: 10, x: 3, y: 4, gridItemName} as BuildingParams),
      new Building({energy: 20, x: 1, y: 2, gridItemName} as BuildingParams),
    ];
    const ruralarea = new RuralArea(buildings, x, y);
    const aBuildingId = buildings[1].getBuildingId();
    expect(ruralarea.getBuildingById(aBuildingId)).toEqual(buildings[1]);
  });

  test('addBuilding()', () => {
    const buildings: Building[] = [
      new Building({energy: 5, x: 2, y: 3, gridItemName} as BuildingParams),
      new Building({energy: 10, x: 3, y: 4, gridItemName} as BuildingParams),
      new Building({energy: 20, x: 1, y: 2, gridItemName} as BuildingParams),
    ];
    const ruralarea = new RuralArea(buildings, 12, 12);
    const newBuilding = new Building({energy: 40, x, y, gridItemName});
    ruralarea.addEnergyUser(newBuilding);
    expect(ruralarea.getEnergyUsers().length).toEqual(4);
  });

  test('addEnergyUser() unique Id', () => {
    const buildings: Building[] = [
      new Building({energy: 5, x: 2, y: 3, gridItemName} as BuildingParams),
      new Building({energy: 10, x: 3, y: 4, gridItemName} as BuildingParams),
    ];
    const ruralarea = new RuralArea(buildings, x, y);
    const newBuilding = new Building({energy: 40, x: 9, y: 9, gridItemName});
    ruralarea.addEnergyUser(newBuilding);
    const isArrayUnique = (arr: number[]) => new Set(arr).size === arr.length;
    expect(
      isArrayUnique(
        ruralarea.getEnergyUsers().map((building) => building.getBuildingId())
      )
    ).toBeTruthy;
  });

  test('add an energy user out of bounds', () => {
    const buildings: Building[] = [
      new Building({energy: 22, x: 113, y: 1114, gridItemName} as BuildingParams),
    ];
    expect(() => {
      const ruralarea = new RuralArea(buildings, x, y);
    }).toThrow("Building relativePosition must be within the town's size constraints");
  });
});
