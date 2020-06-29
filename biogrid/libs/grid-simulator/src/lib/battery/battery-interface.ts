// This is going to be implemented by the battery-class
// Did not export variables because I want them to be private and interfaces does not implement that

export interface Battery {
  getEnergyAmount(): number;
  getMaxcapacity(): number;
  isEmpty(): boolean;
  isFull(): boolean;
}

export interface BatteryState {
  state: unknown
}
