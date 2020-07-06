import { Building } from '@biogrid/biogrid-simulator';

export interface Town {

  getBuildings(): Building[];
  getBuildingById(Id: number): void;
  addBuilding(newBuilding: Building): void;
  
}
