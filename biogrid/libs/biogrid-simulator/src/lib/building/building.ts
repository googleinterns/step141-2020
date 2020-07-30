import {
  EnergyUser,
  ItemPosition,
  Distance,
  Energy,
} from '@biogrid/grid-simulator';
import { BUILDING, RESISTANCE } from '../config';

export interface BuildingParams {
  energy: number;
  x: Distance;
  y: Distance;
  gridItemName: string;
  minCapacity?: Energy;
  maxCapacity?: Energy;
}

// TODO rename energy to power consumption
/**
 * A structure such as a building or house which uses energy to operate.
 */
export class Building implements EnergyUser {
  private energyKilowatt: number;
  // Initial id value, will be changed by rural area.
  private buildingId = -1;
  // Label to be used in the graph
  gridItemName: string;
  // /** The battery storage for the building. */
  // battery: Battery;
  private relativePosition: ItemPosition;
  /** Defines the resistance of the building due to the wiring */
  gridItemResistance = RESISTANCE.BUILDING;

  private readonly minCapacity: Energy = BUILDING.MIN_CAPACITY;
  private readonly maxCapacity: Energy = BUILDING.MAX_CAPACITY;

  /**
   * @param {number} energy Amount of energy the building will have in joules.
   */
  constructor(buildingParams: BuildingParams) {
    this.relativePosition = { x: buildingParams.x, y: buildingParams.y };
    this.gridItemName = buildingParams.gridItemName;
    if (this.isPositive(buildingParams.energy)) {
      this.energyKilowatt = buildingParams.energy;
    } else {
      throw new Error("Can't create a building with negative energy!");
    }
    if (buildingParams.minCapacity) {
      this.minCapacity = buildingParams.minCapacity;
    }
    if (buildingParams.maxCapacity) {
      this.maxCapacity = buildingParams.maxCapacity;
    }
  }

  getMinCapacity(): Energy {
    return this.minCapacity;
  }

  getMaxCapacity(): Energy {
    return this.maxCapacity;
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

  getEnergyInKilowattHour(): number {
    return this.energyKilowatt;
  }

  decreaseEnergyAccordingToTimeOfDay(date: Date) {
    const energyUsed = this.getAverageEnergyUsagePerDay(date.getHours());
    this.decreaseEnergy(energyUsed);
  }

  /**
   * This method adds energy to the current building's power.
   */
  increaseEnergy(energy: number) {
    if (this.isPositive(energy)) {
      this.energyKilowatt += energy;
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
    if (energy >= this.energyKilowatt) {
      this.energyKilowatt = 0;
    } else {
      this.energyKilowatt -= energy;
    }
  }

  private getAverageEnergyUsagePerDay(hourOfDay: number): Energy {
    return BUILDING.ENERGY_USAGE_KILOWATT_BY_TIME_OF_DAY[hourOfDay.toString()];
  }
}
