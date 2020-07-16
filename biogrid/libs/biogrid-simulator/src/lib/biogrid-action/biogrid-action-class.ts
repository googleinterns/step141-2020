import { GridAction, SupplyingPath } from '@biogrid/grid-simulator';

export class BiogridAction implements GridAction {
  private supplyPath: SupplyingPath;
  constructor(supplyPath: SupplyingPath) {
    this.supplyPath = supplyPath;
  }
  public getSupplyingPaths() {
    return this.supplyPath;
  }
}
