/**
 * @file defines @interface Grid which is to be implemented by the microgrid
 * @interface Grid implements functions which run the entire grid.
 *
 * @summary the file holds an interface for the grid which is used to managed all the other gridItems
 * @author Lev Stambler <levst@google.com>
 *
 * Created at     : 6/26/2020, 10:20:42 AM
 * Last modified  : 7/28/2020, 2:50:24 PM
 */

import { StateGraph } from '../state';
import { GridAction } from '../grid-action';

export interface GridOptions {
  [key: string]: unknown;
}

// TODO add in town interface
export interface Grid {
  getSystemState: () => StateGraph;
  takeAction: (action: GridAction) => void;
  updateEnergyUsage: (date: Date) => void;
}
