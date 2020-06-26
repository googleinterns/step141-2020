

//TODO add proper interfaces for batteries once created once created
interface SwitchedOn {
  battery: unknown,
  batteryState: unknown
}

export interface GridAction {
  switchedOnBatteries: SwitchedOn[],
}
