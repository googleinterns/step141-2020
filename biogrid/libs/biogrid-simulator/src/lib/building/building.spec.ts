import { Building, BuildingParams } from './';
import { GRID_ITEM_NAMES } from '../config';

describe('tests for Building class', () => {
  const x = 10;
  const y = 5;
  const gridItemName = GRID_ITEM_NAMES.ENERGY_USER;
  test('negative initial energy', () => {
    expect(() => new Building({energy: -3, x, y, gridItemName} as BuildingParams)).toThrow(
      "Can't create a building with negative energy!"
    );
  });

  test('negative input for increaseEnergy()', () => {
    const building = new Building({energy: 5, x, y, gridItemName} as BuildingParams);
    expect(() => building.increaseEnergy(-5)).toThrow(
      "Can't add negative energy!"
    );
  });

  test('increaseEnergy()', () => {
    const building = new Building({energy: 5, x, y, gridItemName} as BuildingParams);
    building.increaseEnergy(5);
    const expectedEnergy = 10;
    expect(building.getEnergyInKilowattHour()).toEqual(expectedEnergy);
  });

  test('negative input for decreaseEnergy()', () => {
    const building = new Building({energy: 5, x, y, gridItemName} as BuildingParams);
    expect(() => building.decreaseEnergy(-5)).toThrow(
      "Can't use a negative amount of energy!"
    );
  });

  test('decreaseEnergy() with input > current energy', () => {
    const building = new Building({energy: 5, x, y, gridItemName} as BuildingParams);
    building.decreaseEnergy(80);
    const expectedEnergy = 0;
    expect(building.getEnergyInKilowattHour()).toEqual(expectedEnergy);
  });

  test('decreaseEnergy()', () => {
    const building = new Building({energy: 5, x, y, gridItemName} as BuildingParams);
    building.decreaseEnergy(4);
    const expectedEnergy = 1;
    expect(building.getEnergyInKilowattHour()).toEqual(expectedEnergy);
  });
});
