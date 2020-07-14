import { Battery, BatteryState } from '../battery';


//TODO add proper interfaces for batteries once created
export interface SwitchedOnBatteryAction {
  battery: Battery,
  batteryState: BatteryState
}

export interface GridAction {
  getSwitchedOnBatteries: () => SwitchedOnBatteryAction[],
}
