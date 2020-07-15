import { Energy } from '../measurements';
import { StateGraphEdge } from '../state';
import { GridItem } from '../grid-item';

export interface Battery extends GridItem {
  getCurrentBatteryEnergy(): Energy;
  getMaxcapacity(): Energy;
  isEmpty(): boolean;
  isFull(): boolean;
  startCharging(inputPower: Energy): void;
  stopCharging(): void;
  supplyPower(outputenergy: Energy): Energy;
}

export interface BatteryState {
  state: StateGraphEdge
}
