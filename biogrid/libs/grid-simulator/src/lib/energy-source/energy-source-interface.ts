/**
 * @file defines @interface EnergySourceInterface which is to be implemented by any type of source of energy except battery
 * @interface EnergySourceInterface @extends GridItem which enables any source of energy to be inserted in the state graph
 * @interface EnergySourceInterface implements the functions which define the status of the energy source.
 * These functions return a promise because the energy source implements the weather api which returns a promise
 *
 * @summary the file holds an interface for the EnergySource which is the primary source of energy in the grid.
 * @author Lev Stambler <levst@google.com>
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 6/29/2020, 11:50:17 AM
 * Last modified  : 7/28/2020, 2:17:50 PM
 */

import { Power } from "../measurements";
import { GridItem } from '../grid-item';

export interface EnergySourceInterface extends GridItem {
  getPowerAmount(date: Date): Promise<Power>;
  getEnergyInJoules(date?: Date): Promise<Power>;
}
