import {
  EnergyUser,
  Battery,
  ItemPosition,
  Distance,
} from '@biogrid/grid-simulator';

// TODO rename energy to power consumption
/**
 * A structure such as a building or house which uses energy to operate.
 */
export class Building implements EnergyUser {
  private energyInJoules: number;
  // Initial id value, will be changed by rural area.
  private buildingId = -1;
  private relativePosition: ItemPosition;

  /**
   * @param {number} energy Amount of energy the building will have in joules.
   */
  constructor(energy: number, x: Distance, y: Distance) {
    this.relativePosition = { x, y };
    if (this.isPositive(energy)) {
      this.energyInJoules = energy;
    } else {
      throw new Error("Can't create a building with negative energy!");
    }
  }

  getRelativePosition(): ItemPosition {
    return this.relativePosition;
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
