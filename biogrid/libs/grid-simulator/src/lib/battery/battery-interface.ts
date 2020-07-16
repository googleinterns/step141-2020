// This is going to be implemented by the battery-class
// Did not export variables like batteryCapacity because
// I want them to be private and interfaces does not implement that

import { Energy } from '../measurements';
import { StateGraphEdge } from '../state';
import { GridItem } from '../grid-item';

export interface Battery extends GridItem {
  getEnergyInJoules(): Energy;
  isEmpty(): boolean;
  isFull(): boolean;
  startCharging(inputPower: Energy): void;
  stopCharging(): void;
  supplyPower(outputenergy: Energy): Energy;
}
