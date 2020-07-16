import { Power } from '@biogrid/grid-simulator';
import { Validatable, validate, EnergySourceInterface } from '@biogrid/grid-simulator';

export abstract class EnergySource implements EnergySourceInterface {
  // Percentage between 0 and 1
  protected efficiency: number;
  // Long and latitude for the solar panel's position
  protected longitude: number;
  protected latitude: number;
  constructor(efficiency: number, longitude = 0, latitude = 0) {
    if (!this.validateInputs(efficiency)) {
      throw new Error(
        `Cannot create a solar panel object with values: (${efficiency})`
      );
    }
    this.efficiency = efficiency;
    this.longitude = longitude;
    this.latitude = latitude;
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

  abstract getPowerAmount(date: Date): Power;
}
