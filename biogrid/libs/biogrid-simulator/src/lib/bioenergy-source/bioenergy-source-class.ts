import {
  Energy,
  EnergySource,
  Validatable,
  validate,
  ItemPosition,
  Distance,
} from '@biogrid/grid-simulator';

export class BioEnergySource implements EnergySource {
  private sourceCapacity: Energy;
  private readonly minCapacity: Energy;
  private energySourceValidator?: Validatable;
  private position: ItemPosition;

  constructor(
    x: Distance,
    y: Distance,
    sourceCapacity: Energy = 10,
    minCapacity: Energy = 0
  ) {
    this.position = { x, y };

    if (!this.validateInputs(sourceCapacity, minCapacity)) {
      // TODO return a tuple of from validate to with the boolean and unpassed validations
      throw new Error(
        `Cannot create an Energy source object with values: (${sourceCapacity}, ${minCapacity})`
      );
    }
    this.sourceCapacity = sourceCapacity;
    this.minCapacity = minCapacity;
  }

  public getPosition() {
    return this.position;
  }

  public getMinCapacity(): Energy {
    return this.minCapacity;
  }

  private validateInputs(
    sourceCapacity: Energy,
    minCapacity: Energy = this.minCapacity
  ) {
    this.energySourceValidator = {
      value: sourceCapacity,
      min: minCapacity,
      isPositive: sourceCapacity >= 0 && minCapacity >= 0,
    };
    return validate(this.energySourceValidator);
  }

  getpowerAmount(): Energy {
    const tempEnergy = this.sourceCapacity - this.minCapacity;
    this.sourceCapacity = this.minCapacity;
    return tempEnergy;
  }

  set SourceCapacity(inputEnergy: Energy) {
    if (!this.validateInputs(inputEnergy)) {
      // TODO return a tuple of from validate to with the boolean and unpassed validations
      throw new Error(`Cannot set inputEnergy to ${inputEnergy}`);
    }
    this.sourceCapacity = inputEnergy;
  }
}
