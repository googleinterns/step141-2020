/**
 * @file defines the @class Building which describes the buildings in the rural area where the microgrid is implemented
 * This class @implements @interface EnergyUser which add the functionalities for an energy user. This makes the building
 * a gridItem that is responsible for depleting the energy in the grid.
 * The @class Building has 3 main paramaters
 * 1. @param relativePosition which is position of the building in the town / rural area represented by @param x and @param y
 * 2. @param energyInJoules which is the energy / power of the building at any specified time
 * 3. @param gridItemName which is the unique name that identifies the building on the state graph
 *
 * @summary defines the energy user class for a building
 * @author Awad Osman <awado@google.com>
 * @author Lev Stambler <levst@google.com>
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 6/29/2020, 4:26:17 PM
 * Last modified  : 7/29/2020, 9:16:02 AM
 */
import {
  EnergyUser,
  ItemPosition,
  Distance,
  Energy,
} from '@biogrid/grid-simulator';
import { BUILDING, RESISTANCE } from '../config';

export interface BuildingParams {
  energy: number,
  x: Distance,
  y: Distance,
  gridItemName: string,
  minCapacity?: Energy,
  maxCapacity?: Energy,
}

// TODO rename energy to power consumption
/**
 * A structure such as a building or house which uses energy to operate.
 */
export class Building implements EnergyUser {
  private energyInJoules: number;
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
      this.energyInJoules = buildingParams.energy;
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
