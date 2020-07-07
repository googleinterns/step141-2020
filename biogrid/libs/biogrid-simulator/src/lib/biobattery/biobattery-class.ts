import { Battery, Energy, Validatable, validate } from "@biogrid/grid-simulator";

export class BioBattery implements Battery {
  private currentBatteryPower: Energy;
  private readonly maxCapacity: Energy;

  constructor(currentBatteryPower: Energy = 0, maxCapacity: Energy = 10) {
    if (!this.validateInputs(currentBatteryPower, maxCapacity)) {
      // TODO return a tuple of from validate to with the boolean and unpassed validations
      throw new Error(`Cannot create a battery with values: (${currentBatteryPower}, ${maxCapacity})`);
    }
    this.currentBatteryPower = currentBatteryPower;
    this.maxCapacity = maxCapacity;
  }

  startCharging(inputPower: Energy): void {
    if (this.currentBatteryPower + inputPower > this.maxCapacity) {
      this.currentBatteryPower = this.maxCapacity;
    }
    this.currentBatteryPower += inputPower;
  }

  // TODO implement when you use a formula for charging a battery
  stopCharging(): void { }

  supplyPower(outputenergy: Energy): Energy {
    if (this.currentBatteryPower - outputenergy < 0) {
      //TODO implement the function to notify the request with amount of output left
      const temp: Energy = this.currentBatteryPower;
      this.currentBatteryPower = 0;
      return temp;
    }
    this.currentBatteryPower -= outputenergy;
    return outputenergy;
  }

  private validateInputs(currentBatteryPower: Energy, maxCapacity: Energy=this.maxCapacity) {
    const batteryValidator: Validatable = {
      value: currentBatteryPower,
      max: maxCapacity,
      isPositive: currentBatteryPower >= 0 && maxCapacity >= 0
    };
    return validate(batteryValidator);
  }

  getEnergyAmount(): Energy {
    return this.currentBatteryPower;
  }

  getMaxcapacity(): Energy {
    return this.maxCapacity;
  }

  isEmpty(): boolean {
    return this.currentBatteryPower === 0;
  }

  isFull(): boolean {
    return this.currentBatteryPower === this.maxCapacity;
  }
}
