import { Building } from '@biogrid/biogrid-simulator';

export interface Town {

  getBuildings(): Building[];
  addBuilding(newBuilding: Building): Building;
  
}
