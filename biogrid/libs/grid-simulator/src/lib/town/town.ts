import { EnergyUser } from '../energyuser';
import { Distance } from '../measurements';

export interface TownSize {
  width: Distance;
  height: Distance;
}

export interface Town {
  getEnergyUsers(): EnergyUser[];
  addEnergyUser(newUser: EnergyUser): void;
  getTownSize(): TownSize;
}
