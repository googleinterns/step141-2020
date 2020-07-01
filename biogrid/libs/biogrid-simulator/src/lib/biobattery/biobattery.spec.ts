import { BioBattery } from "./";

describe('test for BioBattery class', () => {
  test('battery object throws an error if passed negative Energy', () => {
    const currentpower = -1;
    const maxCapacity = 5;
    expect(() => new BioBattery(currentpower, maxCapacity)).toThrow(
      `Cannot create a battery with values: (${currentpower}, ${maxCapacity})`
    );
  });

  test('battery object throws an error if passed energy more than its capacity', () => {
    const currentpower = 10;
    const maxCapacity = 1;
    expect(() => new BioBattery(currentpower, maxCapacity)).toThrow(
      `Cannot create a battery with values: (${currentpower}, ${maxCapacity})`
    );
  });

  test('battery cannot supply the baterry energy more energy than it has', () => {
    const currentpower = 20;
    const maxCapacity = 30; 
    const battery = new BioBattery(currentpower, maxCapacity);
    const outputenergy = 25;
    const expected = `Requested to supply ${outputenergy} power. Battery only has ${currentpower} units.`;
    expect(() => battery.supplyPower(outputenergy)).toThrow(expected);
  });

  test('battery returns the requested power if it has it', () => {
    const battery = new BioBattery(10, 20);
    const outputenergy = 5;
    expect(battery.supplyPower(outputenergy)).toEqual(outputenergy);
  });

  test('battery is full when it is at capacity', () => {
    const battery = new BioBattery(20, 20);
    const expected = true;
    expect(battery.isFull()).toEqual(expected);
  });

  test('battery is empty when its currentpower is at zero', () => {
    const battery = new BioBattery(1, 10);
    const expected = false;
    expect(battery.isEmpty()).toEqual(expected);
  });
});
