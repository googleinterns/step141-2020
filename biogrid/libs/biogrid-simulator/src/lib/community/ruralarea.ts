import { Towns } from '@biogrid/grid-simulator';
import { Building } from '../building';

export class RuralArea implements Towns{

   private town: Building[];

    constructor(town: Building[]) {
      this.town = town;
    }

    getTown(){
      return this.town;
    }
    getBuilding(building: Building){
      for (let i=0; i<this.town.length; i++){
        if (this.town[i] === building){
          return this.town[i];
        }
      }
      return null;
    }


}