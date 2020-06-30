import { Towns } from '@biogrid/grid-simulator';
import { Building } from '../building';

/**
 * A rural area that represents a community where a microgrid can function.
 */
export class RuralArea implements Towns{

  /** A town of buildings that use energy. */
  private town: Building[];

  /**
   * @param {Building[]} town A given town.
   */
  constructor(town: Building[]) {
    this.town = town;
  }

  /**
   * Gets our current town.
   * @return {Building[]} Returns our town.
   */
  getTown(){
    return this.town;
  }

  /**
   * This method gets a building in a town.
   * @return {Building} Returns the building if found in the list, null if not.
   */
  getBuilding(building: Building){
    for (let i=0; i<this.town.length; i++){
      if (this.town[i] === building){
        return this.town[i];
      }
    }
    return null;
  }

  /**
   * This method adds a building to our town.
   * @param {Building} newBuilding The building to be added. 
   */
  addBuilding(newBuilding: Building){
    this.town.push(newBuilding);
  }

}