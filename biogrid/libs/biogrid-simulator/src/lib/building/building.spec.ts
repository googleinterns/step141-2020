import { Building } from './';

describe('tests for Building class', () => {
  
  test('negative initial energy', () => {
    expect(() => new Building(-3)).toThrow(
      "Can't create a building with negative energy!"
    );
  });

  test('negative input for increaseEnergy()', () => {
    const building = new Building(5);
    expect(() => building.increaseEnergy(-5)).toThrow(
      "Can't add negative energy!"
    );
  }); 

  test('increaseEnergy()', () => {
    const building = new Building(5);
    building.increaseEnergy(5);
    const expectedEnergy = 10;
    expect(building.getEnergyInJoules()).toEqual(expectedEnergy);
  });

  test('negative input for decreaseEnergy()', () => {
    const building = new Building(5);
    expect(() => building.decreaseEnergy(-5)).toThrow(
      "Can't use a negative amount of energy!"
    );
  }); 

  test('decreaseEnergy() with input > current energy', () => {
    const building = new Building(5);
    building.decreaseEnergy(80);
    const expectedEnergy = 0;
    expect(building.getEnergyInJoules()).toEqual(expectedEnergy);
  });

  test('decreaseEnergy()', () => {
    const building = new Building(5);
    building.decreaseEnergy(4);
    const expectedEnergy = 1;
    expect(building.getEnergyInJoules()).toEqual(expectedEnergy);
  });

  test('getters and setters for buildingId', () => {
    const building = new Building(5);
    building.setBuildingId(2);
    expect(building.getBuildingId()).toEqual(2);
  });

});
