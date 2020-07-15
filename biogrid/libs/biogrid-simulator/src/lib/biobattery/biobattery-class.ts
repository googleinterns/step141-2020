import {
  Battery,
  Energy,
  Validatable,
  validate,
  Distance,
  ItemPosition,
} from '@biogrid/grid-simulator';
import { SMALL_BATTERY } from '../config';

export class BioBattery implements Battery {
  private currentBatteryEnergy: Energy;
  private readonly maxCapacity: Energy;
  private position: ItemPosition;

  constructor(
    x: Distance,
    y: Distance,
    currentBatteryEnergy: Energy = SMALL_BATTERY.DEFAULT_START_ENERGY,
    maxCapacity: Energy = SMALL_BATTERY.MAX_CAPACITY
  ) {
    this.position = { x, y };
    if (!this.validateInputs(currentBatteryEnergy, maxCapacity)) {
      // TODO return a tuple of from validate to with the boolean and unpassed validations
      throw new Error(
        `Cannot create a battery with values: (${currentBatteryEnergy}, ${maxCapacity})`
      );
    }
    this.currentBatteryEnergy = currentBatteryEnergy;
    this.maxCapacity = maxCapacity;
  }

  getPosition() {
    return this.position;
  }

  startCharging(inputPower: Energy): void {
    if (this.currentBatteryEnergy + inputPower > this.maxCapacity) {
      this.currentBatteryEnergy = this.maxCapacity;
    }
    this.currentBatteryEnergy += inputPower;
  }

  // TODO implement when you use a formula for charging a battery
  stopCharging(): void {}

  supplyPower(outputenergy: Energy): Energy {
    if (this.currentBatteryEnergy - outputenergy < 0) {
      //TODO implement the function to notify the request with amount of output left
      const temp: Energy = this.currentBatteryEnergy;
      this.currentBatteryEnergy = 0;
      return temp;
    }
    this.currentBatteryEnergy -= outputenergy;
    return outputenergy;
  }

  private validateInputs(
    currentBatteryPower: Energy,
    maxCapacity: Energy = this.maxCapacity
  ) {
    const batteryValidator: Validatable = {
      value: currentBatteryPower,
      max: maxCapacity,
      isPositive: currentBatteryPower >= 0 && maxCapacity >= 0,
    };
    return validate(batteryValidator);
  }

  getEnergyAmount(): Energy {
    return this.currentBatteryEnergy;
  }

  getMaxcapacity(): Energy {
    return this.maxCapacity;
  }

  isEmpty(): boolean {
    return this.currentBatteryEnergy === 0;
  }

  isFull(): boolean {
    return this.currentBatteryEnergy === this.maxCapacity;
  }
}
