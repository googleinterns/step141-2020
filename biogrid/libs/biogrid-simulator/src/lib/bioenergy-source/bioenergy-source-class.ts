import { Energy, EnergySource, Validatable, validate } from "@biogrid/grid-simulator";

export class BioEnergySource implements EnergySource {
  private sourceCapacity: Energy;
  private minCapacity: Energy;
  private energySourceValidator?: Validatable;

  constructor(sourceCapacity: Energy = 10, minCapcity: Energy = 0) {
    
    if (!this.validateInputs(sourceCapacity, minCapcity)) {
      throw 'Cannot create an Energy source object with these values';
    }
    this.sourceCapacity = sourceCapacity;
    this.minCapacity = minCapcity;
  }

  private validateInputs(sourceCapacity: Energy, minCapcity: Energy = this.minCapacity) {
    this.energySourceValidator = {
      value: sourceCapacity,
      min: minCapcity,
      isPositive: sourceCapacity >= 0 && minCapcity >= 0
    };
    return validate(this.energySourceValidator);
  }

  getpowerAmount(): Energy {
    const tempEnergy = this.sourceCapacity;
    this.sourceCapacity = 0;
    return tempEnergy;
  }

  set SourceCapacity(inputEnergy: Energy) {
    if (!this.validateInputs(inputEnergy)){
      throw `Cannot set inputEnergy to ${inputEnergy}`;
    }
    this.sourceCapacity = inputEnergy;
  }
}
