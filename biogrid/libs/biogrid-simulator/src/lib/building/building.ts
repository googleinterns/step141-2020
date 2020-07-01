import { EnergyUser } from '@biogrid/grid-simulator';

/**
 * A structure such as a building or house which uses energy to operate.
 */
export class Building implements EnergyUser {

  private energyInJoules: number;
  private buildingId: number;
  /** The battery storage for the building. */
  battery: unknown;

  /**
   * @param {number} energy Amount of energy the building will have in joules.
   */
  constructor(energy: number) {
    this.energyInJoules = energy;
    this.buildingId = -1;
  }

  getBuildingId() : number {
    return this.buildingId;
  }

  setBuildingId(Id: number) {
    this.buildingId = Id;
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
