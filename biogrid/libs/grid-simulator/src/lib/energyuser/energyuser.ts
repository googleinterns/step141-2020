import { ItemPosition, Energy } from '../measurements';
import { GridItem } from '../grid-item';

export interface EnergyUsageByTimeOfDay {
  [hourOfDay: string]: Energy
}

export interface EnergyUser extends GridItem {
  getEnergyInJoules(): number;
  increaseEnergy(energy: number): void;
  decreaseEnergy(energy: number): void;
  decreaseEnergyAccordingToTimeOfDay(date: Date): void;
}
