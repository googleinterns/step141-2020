import { EnergyUser } from '@biogrid/grid-simulator';

/**
 * A structure such as a building or house which uses energy to operate.
 */
export class Building implements EnergyUser {

  private energyInJoules: number;
  private buildingName: string;
  /** The battery storage for the building. */
  battery: unknown;

  /**
   * @param {number} energy Amount of energy the building will have in joules.
   */
  constructor(energy: number, name: string) {
    this.energyInJoules = energy;
    this.buildingName = name;
  }

  getBuildingName() : string {
    return this.buildingName;
  }

  getEnergyInJoules() : number {
    return this.energyInJoules;
  }

  /**
   * This method adds energy to the current building's power.
   */
  addEnergy(energy: number) {
    this.energyInJoules+=energy;
  }

  /**
   * This method uses energy from the current building's power.
   */
  depleteEnergy(energy: number) {
    this.energyInJoules-=energy;
  }

}
