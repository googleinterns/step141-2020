import { GridAction, SupplyingPath } from '@biogrid/grid-simulator';

export class BiogridAction implements GridAction {
  private supplyPath: SupplyingPath;
  private efficiency: number;
  constructor(supplyPath: SupplyingPath, efficiency: number) {
    this.supplyPath = supplyPath;
    this.efficiency = efficiency;
  }
  public getSupplyingPaths() {
    return this.supplyPath;
  }
  public getEfficiency() {
    return this.efficiency;
  }
}
