import { BioBattery } from './';
import { RESISTANCE } from '../config';

describe('test for BioBattery class', () => {
  test('battery object throws an error if passed negative Energy', () => {
    const currentpower = -1;
    const maxCapacity = 5;
    expect(
      () =>
        new BioBattery({
          xPos: 10,
          yPos: 5,
          id: 'small_battery',
          resistance: RESISTANCE.SMALL_BATTERY,
          initialEnergyInJoules: currentpower,
          maxCapacityInJoules: maxCapacity,
        })
    ).toThrow(
      `Cannot create a battery with values: (${currentpower}, ${maxCapacity})`
    );
  });

  test('battery object throws an error if passed energy more than its capacity', () => {
    const currentpower = 10;
    const maxCapacity = 1;
    expect(
      () =>
        new BioBattery({
          xPos: 10,
          yPos: 5,
          id: 'small_battery',
          resistance: RESISTANCE.SMALL_BATTERY,
          initialEnergyInJoules: currentpower,
          maxCapacityInJoules: maxCapacity,
        })
    ).toThrow(
      `Cannot create a battery with values: (${currentpower}, ${maxCapacity})`
    );
  });

  test('battery returns less or equal to power requested', () => {
    const currentpower = 20;
    const maxCapacity = 30;
    const battery = new BioBattery({
      xPos: 10,
      yPos: 5,
      id: 'small_battery',
      resistance: RESISTANCE.SMALL_BATTERY,
      initialEnergyInJoules: currentpower,
      maxCapacityInJoules: maxCapacity,
    });
    const outputenergy = 25;
    const expected = 25;
    expect(battery.supplyPower(outputenergy)).toBeLessThanOrEqual(expected);
  });

  test('battery is full when it is at capacity', () => {
    const battery = new BioBattery({
      xPos: 10,
      yPos: 5,
      id: 'small_battery',
      resistance: RESISTANCE.SMALL_BATTERY,
      initialEnergyInJoules: 20,
      maxCapacityInJoules: 20,
    });
    const expected = true;
    expect(battery.isFull()).toEqual(expected);
  });

  test('battery is empty when its currentpower is at zero', () => {
    const battery = new BioBattery({
      xPos: 10,
      yPos: 5,
      id: 'small_battery',
      resistance: RESISTANCE.SMALL_BATTERY,
      initialEnergyInJoules: 1,
      maxCapacityInJoules: 10,
    });
    const expected = false;
    expect(battery.isEmpty()).toEqual(expected);
  });
});
