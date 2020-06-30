import { EnergyUsers } from '@biogrid/grid-simulator';

/**
 * A structure such as a building or house which uses energy to operate.
 */
export class Building implements EnergyUsers {

  /** The amount of energy the building has. */
  private energyCount: number;
  /** The name identifier of the building. */
  private buildingName: string;
  /** The battery for the building. */
  battery: unknown;

  /**
   * @param {number} energy Amount of energy the building will have in joules.
   * @param {string} name The name the building is assigned. 
   */
  constructor(energy: number, name: string){
    this.energyCount = energy;
    this.buildingName = name;
  }

  /**
   * @return {string} The name of the building.
   */
  getBuildingName(){
    return this.buildingName;
  }
  /**
   * @return {number} The current amount of energy the building has.
   */
  getAmountEnergyUsed(){
    return this.energyCount;
  }

  /**
   * This method adds energy to the current building's power.
   * @param energy The energy received.
   */
  energyReceived(energy: number){
    this.energyCount+=energy;
  }

  /**
   * This method uses energy from the current building's power.
   * @param energy The amount of energy used.
   */
  depleteEnergy(energy: number){
    this.energyCount-=energy;
  }

}
