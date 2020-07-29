import { GridAction, SupplyingPath } from '@biogrid/grid-simulator';

export class BiogridAction implements GridAction {
  constructor(
    private supplyPath: SupplyingPath,
    private efficiency: number
  ) {}
  public getSupplyingPaths() {
    return this.supplyPath;
  }
  public getEfficiency() {
    return this.efficiency;
  }
}
