import { BioBattery, BatteryParams } from "./";
import { RESISTANCE } from "../config";

describe('test for BioBattery class', () => {
  test('battery object throws an error if passed negative Energy', () => {
    const currentpower = -1;
    const maxCapacity = 5;
    expect(() => new BioBattery({
      x: 10,
      y: 5, 
      gridItemName: 'small_battery',
      gridItemResistance: RESISTANCE.SMALL_BATTERY,
      energyInJoules: currentpower,
      maxCapacity
    } as BatteryParams)).toThrow(
      `Cannot create a battery with values: (${currentpower}, ${maxCapacity})`
    );
  });

  test('battery object throws an error if passed energy more than its capacity', () => {
    const currentpower = 10;
    const maxCapacity = 1;
    expect(() => new BioBattery({
      x: 10,
      y: 5, 
      gridItemName: 'small_battery',
      gridItemResistance: RESISTANCE.SMALL_BATTERY,
      energyInJoules: currentpower,
      maxCapacity
    } as BatteryParams)).toThrow(
      `Cannot create a battery with values: (${currentpower}, ${maxCapacity})`
    );
  });

  test('battery returns less or equal to power requested', () => {
    const currentpower = 20;
    const maxCapacity = 30;
    const battery = new BioBattery({
      x: 10,
      y: 5, 
      gridItemName: 'small_battery',
      gridItemResistance: RESISTANCE.SMALL_BATTERY,
      energyInJoules: currentpower,
      maxCapacity
    } as BatteryParams);
    const outputenergy = 25;
    const expected = 25;
    expect(battery.supplyPower(outputenergy)).toBeLessThanOrEqual(expected);
  });

  test('battery is full when it is at capacity', () => {
    const battery = new BioBattery({
      x: 10,
      y: 5, 
      gridItemName: 'small_battery',
      gridItemResistance: RESISTANCE.SMALL_BATTERY,
      energyInJoules: 20,
      maxCapacity: 20
    } as BatteryParams);
    const expected = true;
    expect(battery.isFull()).toEqual(expected);
  });

  test('battery is empty when its currentpower is at zero', async () => {
    const battery = new BioBattery({
      x: 10,
      y: 5, 
      gridItemName: 'small_battery',
      gridItemResistance: RESISTANCE.SMALL_BATTERY,
      energyInJoules: 1,
      maxCapacity: 10
    } as BatteryParams);
    const expected = false;
    expect(await battery.isEmpty()).toEqual(expected);
  });
});
