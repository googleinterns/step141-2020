import { WeatherLib } from '@biogrid/weather';
import { SolarPanel } from './';
import { GRID_ITEM_NAMES } from '../config';
import { SolarPanelParams } from './solar-panel';

describe('tests for the BioEnergySource', () => {
  const x = 2,
    y = 3;
  test('Cannot create a solar panel when passed negative values', () => {
    const area = -10;
    const efficiency = 0.125;
    const expected = `Cannot create a solar panel object with values of area ${area}`;
    expect(
      () =>
        new SolarPanel({
          x,
          y,
          areaSquareMeters: area,
          gridItemName: GRID_ITEM_NAMES.SOLAR_PANEL,
          efficiency,
        } as SolarPanelParams)
    ).toThrow(expected);
  });

  test('Cannot create an energySource when its efficiency is out of range', () => {
    const area = 1;
    const efficiency = 10;
    const expected = `Cannot create a solar panel object with values: (${efficiency})`;
    expect(
      () =>
        new SolarPanel({
          x,
          y,
          areaSquareMeters: area,
          gridItemName: GRID_ITEM_NAMES.SOLAR_PANEL,
          efficiency,
        } as SolarPanelParams)
    ).toThrow(expected);
  });

  test('Get the power output from the solar panel at night time', async () => {
    const longitude = 0,
      efficiency = 0.125,
      latitude = 0,
      area = 10,
      date = new Date();
    date.setHours(0);
    const energySource = new SolarPanel({
      x,
      y,
      efficiency,
      longitude,
      latitude,
      date,
      areaSquareMeters: area,
      gridItemName: GRID_ITEM_NAMES.SOLAR_PANEL,
    } as SolarPanelParams);
    const weather = new WeatherLib(date, longitude, latitude);
    await weather.setup();
    expect(await energySource.getPowerAmount(date)).toEqual(0);
  });

  test('Get the power output from the solar panel during day time', async () => {
    const longitude = 0,
      efficiency = 0.125,
      latitude = 0,
      area = 10,
      date = new Date();
    const energySource = new SolarPanel({
      x,
      y,
      areaSquareMeters: area,
      gridItemName: GRID_ITEM_NAMES.SOLAR_PANEL,
      efficiency,
      longitude,
      latitude,
      date,
    } as SolarPanelParams);
    const weather = new WeatherLib(date, longitude, latitude);
    await weather.setup();
    // 10 AM local time
    date.setHours(10);
    expect(await energySource.getPowerAmount(date)).toBeGreaterThan(0);
  });
});
