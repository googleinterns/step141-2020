import { BioEnergySource } from "./";

describe('tests for the BioEnergySource', () => {
  test('Cannot create an energySource when passed negative values', () => {
    const expected = 'Cannot create an Energy source object with these values';
    expect(() => new BioEnergySource(-1, 0)).toThrow(expected);
  });

  test('Cannot create an energySource when its energy is lower than the minimum', () => {
    const expected = 'Cannot create an Energy source object with these values';
    expect(() => new BioEnergySource(1, 10)).toThrow(expected);
  });

  test('Cannot set the source capacity to less than minCapacity or negative', () => {
    const energySource = new BioEnergySource(10,10);
    const inputEnergy = 5; // Anything less than 10 should not pass;
    const expected = `Cannot set inputEnergy to ${inputEnergy}`;
    expect(() => energySource.SourceCapacity = inputEnergy).toThrow(expected);
  });

  test('Get the energy that can be supplied by the energySource', () => {
    const energySource = new BioEnergySource();
    const inputEnergy = 20;
    const expected = 20;
    // This will not throw an error because we are passing the right inputs
    // but method can throw an error as seen in the above test
    try {
      energySource.SourceCapacity = inputEnergy;
    } catch (e) {
      console.log(e);
    }
    expect(energySource.getpowerAmount()).toEqual(expected);
  });
});