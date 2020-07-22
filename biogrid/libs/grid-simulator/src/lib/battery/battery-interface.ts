import { Energy } from '../measurements';
import { GridItem } from '../grid-item';

export interface Battery extends GridItem {
  getEnergyInJoules(): Energy;
  isEmpty(): boolean;
  isFull(): boolean;
  startCharging(inputPower: Energy): void;
  stopCharging(): void;
  supplyPower(outputenergy: Energy): Energy;
}
