import {
  Energy,
  EnergySource,
  Validatable,
  validate,
  ItemPosition,
  Distance,
} from '@biogrid/grid-simulator';
import { GRID_ITEM_NAMES, SOLAR_PANEL } from '../config';

export class BioEnergySource implements EnergySource {
  private sourceCapacity: Energy;
  private readonly minCapacity: Energy;
  private energySourceValidator?: Validatable;
  private position: ItemPosition;
  name: string;

  constructor(
    x: Distance,
    y: Distance,
    name: string = GRID_ITEM_NAMES.SOLAR_PANEL,
    sourceCapacity: Energy = SOLAR_PANEL.DEFAULT_INITIAL_ENERGY,
    minCapacity: Energy = SOLAR_PANEL.MIN_CAPACITY
  ) {
    this.position = { x, y };
    this.name = name;
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

  supplyPower(requiredEnergy: Energy): Energy {
    this.sourceCapacity = this.sourceCapacity - requiredEnergy;
    return requiredEnergy;
  }

  getEnergyInJoules() {
    return this.sourceCapacity;
  }

  get MinCapacity(): Energy {
    return this.minCapacity;
  }

  isEmpty(): boolean {
    return this.sourceCapacity === this.minCapacity;
  }

  set SourceCapacity(inputEnergy: Energy) {
    if (!this.validateInputs(inputEnergy)) {
      // TODO return a tuple of from validate to with the boolean and unpassed validations
      throw new Error(`Cannot set inputEnergy to ${inputEnergy}`);
    }
    this.sourceCapacity = inputEnergy;
  }
}
