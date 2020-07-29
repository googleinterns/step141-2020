import { Power, ItemPosition, Distance } from '@biogrid/grid-simulator';
import {
  Validatable,
  validate,
  EnergySourceInterface,
} from '@biogrid/grid-simulator';

export interface EnergySourceParams {
  x: Distance,
  y: Distance,
  efficiency: number,
  longitude?: number,
  latitude?: number,
}

export abstract class EnergySource implements EnergySourceInterface {
  // Percentage between 0 and 1
  protected efficiency: number;
  // Long and latitude for the solar panel's position
  protected longitude = 0;
  protected latitude = 0;
  protected position: ItemPosition;
  constructor(energyParams: EnergySourceParams) {
    this.position = { x: energyParams.x, y: energyParams.y };
    if (!this.validateInputs(energyParams.efficiency)) {
      throw new Error(
        `Cannot create a solar panel object with values: (${energyParams.efficiency})`
      );
    }
    this.efficiency = energyParams.efficiency;
    if (energyParams.longitude) {
      this.longitude = energyParams.longitude;
    }
    if (energyParams.latitude) {
      this.latitude = energyParams.latitude;
    }
  }

  private validateInputs(efficiency: number) {
    const efficiencyValidator: Validatable = {
      value: efficiency,
      min: 0,
      max: 1,
      isPositive: efficiency >= 0,
    };
    return validate(efficiencyValidator);
  }

  getRelativePosition() {
    return this.position;
  }

  abstract getPowerAmount(date: Date): Promise<Power>;
  abstract getEnergyInJoules(date?: Date): Promise<Power>;
  abstract gridItemName: string;
  abstract gridItemResistance: number;
}
