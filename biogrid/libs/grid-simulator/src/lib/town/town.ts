/**
 * @file defines @interface Town which defines a list of energy users (buildings) in the town
 * The file also defines the @interface TownSize which holds the height and width for the town
 * which is used to place items in the grid
 * 
 * @summary the file defines a specific town where a grid is located
 * @author Awad Osman <awado@google.com>
 * @author Lev Stambler <levst@google.com>
 *
 * Created at     : 6/30/2020, 5:39:31 PM
 * Last modified  : 7/28/2020, 4:18:50 PM
 */

import { EnergyUser } from '../energyuser';
import { Distance } from '../measurements';

export interface TownSize {
  width: Distance;
  height: Distance;
}

export interface Town {
  getEnergyUsers(): EnergyUser[];
  addEnergyUser(newUser: EnergyUser): void;
  getTownSize(): TownSize;
}
