import { getSunlight } from '@biogrid/weather';
import { SolarPanel } from './';
import { GRID_ITEM_NAMES } from '../config';

describe('tests for the BioEnergySource', () => {
  const x = 2,
    y = 3;
  test('Cannot create a solar panel when passed negative values', () => {
    const area = -10;
    const efficiency = 0.125;
    const expected = `Cannot create a solar panel object with values of area ${area}`;
    expect(() => new SolarPanel(x, y, area, GRID_ITEM_NAMES.SOLAR_PANEL, efficiency)).toThrow(expected);
  });

  test('Cannot create an energySource when its efficiency is out of range', () => {
    const area = 1;
    const efficiency = 10;
    const expected = `Cannot create a solar panel object with values: (${efficiency})`;
    expect(() => new SolarPanel(x, y, area, GRID_ITEM_NAMES.SOLAR_PANEL, efficiency)).toThrow(expected);
  });

  test('Get the power output from the solar pannel', () => {
    const longitude = 0,
      efficiency = 0.125,
      latitude = 0,
      area = 10,
      date = new Date();
    const energySource = new SolarPanel(
      x,
      y,
      area,
      GRID_ITEM_NAMES.SOLAR_PANEL,
      efficiency,
      longitude,
      latitude
    );

    const intensity = getSunlight(date, longitude, latitude);
    const expected = intensity * 0.0079 * efficiency * area;
    expect(energySource.getPowerAmount(date)).toEqual(expected);
  });
});
