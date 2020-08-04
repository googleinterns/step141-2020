/**
 * @summary defines the unit tests for the @class BioBattery
 * @author Lev Stambler <levst@google.com>
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 6/30/2020, 7:18:04 PM
 * Last modified  : 7/29/2020, 10:33:54 AM
 */
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
      energyInKiloWattHour: currentpower,
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
      energyInKiloWattHour: currentpower,
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
      energyInKiloWattHour: currentpower,
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
      energyInKiloWattHour: 20,
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
      energyInKiloWattHour: 1,
      maxCapacity: 10
    } as BatteryParams);
    const expected = false;
    expect(battery.isEmpty()).toEqual(expected);
  });
});
