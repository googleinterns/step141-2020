import { EnergyUser } from '../energyuser';

export interface Town {

  getBuildings(): EnergyUser[];
  
}
