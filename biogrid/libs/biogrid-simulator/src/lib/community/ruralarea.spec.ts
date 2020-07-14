import { Building } from '../building';
import { RuralArea } from './';

describe('tests for RuralArea class', () => {
  const x = 10,
    y = 10;
  test('getBuildingById()', () => {
    const buildings: Building[] = [
      new Building(5, 2, 3),
      new Building(10, 3, 4),
      new Building(20, 1, 2),
    ];
    const ruralarea = new RuralArea(buildings, x, y);
    const aBuildingId = buildings[1].getBuildingId();
    expect(ruralarea.getBuildingById(aBuildingId)).toEqual(buildings[1]);
  });

  test('addBuilding()', () => {
    const buildings: Building[] = [
      new Building(5, 2, 3),
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
      new Building(5, 2, 2),
      new Building(8, 1, 1),
    ];
    const ruralarea = new RuralArea(buildings, x, y);
    const newBuilding = new Building(40, 9, 9);
    ruralarea.addEnergyUser(newBuilding);
    expect(ruralarea.getEnergyUsers()[1].getBuildingId()).toEqual(
      buildings[1].getBuildingId()
    );
  });

  test('add an energy user out of bounds', () => {
    const buildings: Building[] = [new Building(5, 22, 10)];
    expect(() => {
      const ruralarea = new RuralArea(buildings, x, y);
    }).toThrow("Building position must be within the town's size constraints");
  });
});
