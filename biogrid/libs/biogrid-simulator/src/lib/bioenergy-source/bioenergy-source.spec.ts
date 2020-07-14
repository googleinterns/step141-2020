import { BioEnergySource } from './';

describe('tests for the BioEnergySource', () => {
  const x = 10;
  const y = 5;
  test('Cannot create an energySource when passed negative values', () => {
    const sourceEnergy = -1;
    const minCapacity = 0;
    const expected = `Cannot create an Energy source object with values: (${sourceEnergy}, ${minCapacity})`;
    expect(() => new BioEnergySource(x, y, sourceEnergy, minCapacity)).toThrow(
      expected
    );
  });

  test('Cannot create an energySource when its energy is lower than the minimum', () => {
    const sourceEnergy = 1;
    const minCapacity = 10;
    const expected = `Cannot create an Energy source object with values: (${sourceEnergy}, ${minCapacity})`;
    expect(() => new BioEnergySource(x, y, sourceEnergy, minCapacity)).toThrow(
      expected
    );
  });

  test('Cannot create an energySource when its position is negative', () => {
    const x = -2,
      y = -4;
    const sourceEnergy = 1;
    const minCapacity = 10;
    const expected = `Cannot create an Energy source object with values: (${sourceEnergy}, ${minCapacity})`;
    expect(() => new BioEnergySource(x, y, sourceEnergy, minCapacity)).toThrow(
      expected
    );
  });

  test('Cannot set the source capacity to less than minCapacity or negative', () => {
    const energySource = new BioEnergySource(x, y, 10, 10);
    const inputEnergy = 5; // Anything less than 10 should not pass;
    const expected = `Cannot set inputEnergy to ${inputEnergy}`;
    expect(() => (energySource.SourceCapacity = inputEnergy)).toThrow(expected);
  });

  test('Get the energy that can be supplied by the energySource', () => {
    const energySource = new BioEnergySource(x, y);
    const inputEnergy = 20;
    const expected = 20;
    // This will not throw an error because we are passing the right inputs
    // but method can throw an error as seen in the above test
    try {
      energySource.SourceCapacity = inputEnergy;
    } catch (error) {
      console.log(`Error thrown while setting the energy Source: ${error}`);
    }
    expect(energySource.getpowerAmount()).toEqual(expected);
  });
});
