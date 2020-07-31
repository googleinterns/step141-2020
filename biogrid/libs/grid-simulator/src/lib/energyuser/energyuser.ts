/**
 * @file defines @interface EnergyUser which is to be implemented by any type of battery
 * @interface EnergyUser @extends GridItem which enables any energy user to be inserted in the state graph
 * @interface EnergyUser implements the functions which define the state of the energy user.
 *
 * @summary the file holds an interface for the energy users which represents primary grid items that deplete energy
 * @author Awad Osman <awado@google.com>
 * @author Lev Stambler <levst@google.com>
 *
 * Created at     : 6/30/2020, 5:39:31 PM
 * Last modified  : 7/28/2020, 2:29:24 PM
 */

import { Energy } from '../measurements';
import { GridItem } from '../grid-item';

export interface EnergyUsageByTimeOfDay {
  [hourOfDay: string]: Energy
}

export interface EnergyUser extends GridItem {
  getEnergyInJoules(): number;
  increaseEnergy(energy: number): void;
  decreaseEnergy(energy: number): void;
  decreaseEnergyAccordingToTimeOfDay(date: Date): void;
}
