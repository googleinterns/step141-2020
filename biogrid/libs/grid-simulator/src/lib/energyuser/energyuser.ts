import { ItemPosition } from '../measurements';
import { GridItem } from '../grid-item';

export interface EnergyUser extends GridItem {
  getEnergyInJoules(): number;
  increaseEnergy(energy: number): void;
  decreaseEnergy(energy: number): void;
}
