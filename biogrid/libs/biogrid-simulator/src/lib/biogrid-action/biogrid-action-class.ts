import { GridAction, SwitchedOnBatteryAction } from '@biogrid/grid-simulator';

export class BiogridAction implements GridAction {
  private switchedOnBatteries: SwitchedOnBatteryAction[];
  constructor(switchedOnBatteries: SwitchedOnBatteryAction[]) {
    this.switchedOnBatteries = switchedOnBatteries;
  }
  public getSwitchedOnBatteries() {
    return this.switchedOnBatteries;
  }
}
