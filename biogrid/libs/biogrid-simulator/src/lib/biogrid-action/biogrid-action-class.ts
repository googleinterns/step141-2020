/**
 * @file defines the @class BiogridAction which describes action sent by the brain to the grid.
 * This class @implements @interface GridAction which add the functionalities for the action to be
 * received after the brain has processed the state of the graph and defined where the energy should go
 * The action comprises of 2 main parts:
 * 1. @param supplyPath which holds a key-value pair of the reciever-supplier of energy
 * 2. @param efficiency which is the efficiency of the decision made the brain
 *
 * @summary defines the action to be taken by the grid in supplying energy
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
