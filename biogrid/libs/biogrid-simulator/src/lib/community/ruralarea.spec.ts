import { Building } from '../building';
import { RuralArea } from './';

describe('tests for RuralArea class', () => {
  const x = 10,
    y = 10;
  test('getBuildingById()', () => {
    const buildings: Building[] = [
      new Building(/* energy = */ 5, /* x = */ 2, /* y = */ 3),
      new Building(/* energy = */ 10, /* x = */ 3, /* y = */ 4),
      new Building(/* energy = */ 20, /* x = */ 1, /* y = */ 2),
    ];
    const ruralarea = new RuralArea(buildings, x, y);
    const aBuildingId = buildings[1].getBuildingId();
    expect(ruralarea.getBuildingById(aBuildingId)).toEqual(buildings[1]);
  });

  test('addBuilding()', () => {
    const buildings: Building[] = [
      new Building(/* energy = */ 5, /* x = */ 2, /* y = */ 3),
      new Building(10, 3, 4),
      new Building(20, 1, 2),
    ];
    const ruralarea = new RuralArea(buildings, 12, 12);
    const newBuilding = new Building(40, x, y);
    ruralarea.addEnergyUser(newBuilding);
    expect(ruralarea.getEnergyUsers().length).toEqual(4);
  });

  test('addEnergyUser() unique Id', () => {
    const buildings: Building[] = [
      new Building(/* energy = */ 5, /* x = */ 2, /* y = */ 3),
      new Building(10, 3, 4),
    ];
    const ruralarea = new RuralArea(buildings, x, y);
    const newBuilding = new Building(40, 9, 9);
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
      new Building(/* energy = */ 22, /* x = */ 113, /* y = */ 1114),
    ];
    expect(() => {
      const ruralarea = new RuralArea(buildings, x, y);
    }).toThrow("Building position must be within the town's size constraints");
  });
});
