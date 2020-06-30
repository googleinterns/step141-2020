import { Town } from '@biogrid/grid-simulator';
import { Building } from '../building';

/**
 * A rural area that represents a community where a microgrid can function.
 */
export class RuralArea implements Town {

  private town: Building[];

  /**
   * @param {Building[]} town A list of buildings which make up a town.
   */
  constructor(town: Building[]) {
    this.town = town;
  }

  getTown() : Building[] {
    return this.town;
  }

  /**
   * This method gets a building in a town by its name identifier.
   * @param {Building} building The building we're looking for.
   * @return {Building} Returns the building if found in the list, null if not.
   */
  getBuildingByName(building: Building) {
    for (let i=0; i<this.town.length; i++){
      if (this.town[i].getBuildingName() === building.getBuildingName()){
        return this.town[i];
      }
    }
    return null;
  }

  /**
   * This method adds a building to our town.
   * @param {Building} newBuilding The building to be added. 
   */
  addBuilding(newBuilding: Building) {
    this.town.push(newBuilding);
  }

}
