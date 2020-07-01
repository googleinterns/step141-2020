import { BioBattery } from "./";

describe('test for BioBattery class', () => {
  test('battery object throws an error if passed negative Energy', () => {
    expect(() => new BioBattery(-1, 5)).toThrow(
      'Cannot create a battery with these values'
    );
  });

  test('battery object throws an error if passed energy more than its capacity', () => {
    expect(() => new BioBattery(10, 1)).toThrow(
      'Cannot create a battery with these values'
    );
  });

  test('battery cannot supply the baterry energy more energy than it has', () => {
    const battery = new BioBattery(20, 30);
    const outputenergy = 25;
    const expected = `Battery has less than ${outputenergy} units`;
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
