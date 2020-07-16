import { GridAction, SupplyingPath } from '@biogrid/grid-simulator';

export class BiogridAction implements GridAction {
  private switchedOnBatteries: SupplyingPath;
  constructor(switchedOnBatteries: SupplyingPath) {
    this.switchedOnBatteries = switchedOnBatteries;
  }
  public getSupplyingPaths() {
    return this.switchedOnBatteries;
  }
}
