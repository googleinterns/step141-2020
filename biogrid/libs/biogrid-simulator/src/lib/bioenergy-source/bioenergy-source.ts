/**
 * @file defines the @abstract @class EnergySource which describes energy sources.
 * It @implements @interface EnergySourceInterface which add the functionalities the energy source
 * The class defines:
 * 1. @param position which describes the position of the energy source relative to the town
 * 2. @param latitude and @param longitude which define the position of the energy source on a map. This is used by the
 * weather api to get the sunlight data
 * 3. @abstract @method getPowerAmount which is the power produced by the energy source at a given date
 * 4. @abstract @method getEnergyInJoules which is the current power of the energy source
 *
 * @summary is abstract class for an energy source
 * @author Lev Stambler <levst@google.com>
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 7/16/2020, 3:06:36 PM
 * Last modified  : 7/29/2020, 9:55:17 AM
 */
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
  protected longitude: number = 0;
  protected latitude: number = 0;
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
  abstract getEnergyInJoules(): Promise<Power>;
  abstract gridItemName: string;
  abstract gridItemResistance: number;
}
