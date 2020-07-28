/**
 * @file defines @interface Battery which is to be implemented by any type of battery
 * @interface Battery @extends GridItem which enables any type of battery to be inserted in the state graph
 * @interface Battery implements the functions which define the battery's status.
 * For instance if it is charged, or not. It also implements functions which enable charging the battery, or supplying the battery's
 * energy
 *
 * @summary the file holds an interface for the battery which contains the functions to be implemented by all batteries.
 * @author Lev Stambler <levst@google.com>
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 6/29/2020, 11:49:12 AM
 * Last modified  : 7/28/2020, 2:08:50 PM
 */
import { Energy } from '../measurements';
import { GridItem } from '../grid-item';

export interface Battery extends GridItem {
  getEnergyInJoules(): Energy;
  isEmpty(): boolean;
  isFull(): boolean;
  startCharging(inputPower: Energy): void;
  stopCharging(): void;
  supplyPower(outputenergy: Energy): Energy;
}
