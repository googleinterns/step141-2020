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
    this.setCurrentBuildingIds();
  }

  getTown() : Building[] {
    return this.town;
  }

  /**
   * This method gets a building in a town by its name identifier.
   * @param {Building} building The building we're looking for.
   * @return {Building} Returns the building if found in the list, null if not.
   */
  getBuildingById(Id: number) {
    for (let i=0; i<this.town.length; i++) {
      if (this.town[i].getBuildingId() === Id) {
        return this.town[i];
      }
    }
    return null;
  }

  /**
   * This method adds a building to our town.
   * @param {Building} newBuilding The building to be added. 
   */
  addBuilding(newBuilding: Building) : Building {
    newBuilding.setBuildingId(this.town.length);
    this.town.push(newBuilding);
    return newBuilding;
  }

  /**
   * This method sets the id's of buildings that were not added.
   */
  setCurrentBuildingIds() {
    for (let i=0; i<this.town.length; i++){
      this.town[i].setBuildingId(i);
    }
  }

}
