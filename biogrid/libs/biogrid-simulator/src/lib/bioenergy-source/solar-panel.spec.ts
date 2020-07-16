import { getSunlight } from '@biogrid/weather';
import { SolarPanel } from './';

describe('tests for the BioEnergySource', () => {
  test('Cannot create a solar panel when passed negative values', () => {
    const area = -10;
    const efficiency = 0.125;
    const expected = `Cannot create a solar panel object with values: (${area}, ${efficiency})`;
    expect(() => new SolarPanel(area, efficiency)).toThrow(expected);
  });

  test('Cannot create an energySource when its efficiency is out of range', () => {
    const area = 1;
    const efficiency = 10;
    const expected = `Cannot create a solar panel object with values: (${area}, ${efficiency})`;
    expect(() => new SolarPanel(area, efficiency)).toThrow(expected);
  });

  test('Get the power output from the solar pannel', () => {
    const longitude = 0,
      efficiency = 0.125,
      latitude = 0,
      area = 10,
      date = new Date();
    const energySource = new SolarPanel(area, efficiency, longitude, latitude);

    const intensity = getSunlight(
      date,
      longitude,
      latitude
    );
    const expected = intensity * 0.0079 * efficiency * area;
    expect(energySource.getPowerAmount(date)).toEqual(expected);
  });
});
