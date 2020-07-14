import { EnergyUser } from '../energyuser';

export interface Town {
  getEnergyUsers(): EnergyUser[];
  addEnergyUser(newUser: EnergyUser): void;
}
