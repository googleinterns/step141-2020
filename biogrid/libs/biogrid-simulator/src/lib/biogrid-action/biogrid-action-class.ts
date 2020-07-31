/**
 * @summary defines the action sent by the brain to the grid.
 * @author Lev Stambler <levst@google.com>
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 6/29/2020, 8:56:21 AM
 * Last modified  : 7/29/2020, 9:34:52 AM
 */
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
