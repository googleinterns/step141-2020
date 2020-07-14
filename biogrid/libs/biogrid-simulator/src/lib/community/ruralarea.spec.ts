import { Building } from '../building';
import { RuralArea } from './';


describe('tests for RuralArea class', () => {
  test('getBuildingById()', () => {
    const buildings : Building[] = [new Building(5), new Building(10), new Building(20)];
    const ruralarea = new RuralArea(buildings);
    const aBuildingId = buildings[1].getBuildingId();
    expect(ruralarea.getBuildingById(aBuildingId)).toEqual(buildings[1]);
  });

  test('addBuilding()', () => {
    const buildings : Building[] = [new Building(5), new Building(10), new Building(20)];
    const ruralarea = new RuralArea(buildings);
    const newBuilding = new Building(40);
    ruralarea.addEnergyUser(newBuilding);
    expect(ruralarea.getEnergyUsers().length).toEqual(4);
  });

  test('addEnergyUser() unique Id', () => {
    const buildings : Building[] = [new Building(5), new Building(8)];
    const ruralarea = new RuralArea(buildings);
    const newBuilding = new Building(40);
    ruralarea.addEnergyUser(newBuilding);
    expect(ruralarea.getEnergyUsers()[1].getBuildingId()).toEqual(buildings[1].getBuildingId());
  });

});

