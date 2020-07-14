import {
  EnergyUser,
  Battery,
  ItemPosition,
  Distance,
} from '@biogrid/grid-simulator';

/**
 * A structure such as a building or house which uses energy to operate.
 */
// TODO rename energy to power consumption
export class Building implements EnergyUser {
  private energyInJoules: number;
  // Initial id value, will be changed by rural area.
  private buildingId = -1;
  private position: ItemPosition;
  // /** The battery storage for the building. */
  // battery: Battery;

  /**
   * @param {number} energy Amount of energy the building will have in joules.
   */
  constructor(energy: number, x: Distance, y: Distance) {
    this.position = { x, y };
    if (this.isPositive(energy)) {
      this.energyInJoules = energy;
    } else {
      throw new Error("Can't create a building with negative energy!");
    }
  }

  getPosition(): ItemPosition {
    return this.position;
  }

  private isPositive(energy: number): boolean {
    return energy >= 0;
  }

  getBuildingId(): number {
    return this.buildingId;
  }

  setBuildingId(Id: number) {
    this.buildingId = Id;
  }

  getEnergyInJoules(): number {
    return this.energyInJoules;
  }

  /**
   * This method adds energy to the current building's power.
   */
  increaseEnergy(energy: number) {
    if (this.isPositive(energy)) {
      this.energyInJoules += energy;
    } else {
      throw new Error("Can't add negative energy!");
    }
  }

  /**
   * This method uses energy from the current building's power.
   */
  decreaseEnergy(energy: number) {
    if (!this.isPositive(energy)) {
      throw new Error("Can't use a negative amount of energy!");
    }
    // Building can't have a negative amount of energy in store.
    if (energy >= this.energyInJoules) {
      this.energyInJoules = 0;
    } else {
      this.energyInJoules -= energy;
    }
  }
}
