import { EnergyUser } from '../energyuser';

export interface Town {

  getBuildings(): EnergyUser[];
  addBuilding(newBuilding: EnergyUser): EnergyUser;

}
