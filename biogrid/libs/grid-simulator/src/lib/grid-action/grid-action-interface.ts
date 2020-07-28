/**
 * @file contains defines @interface GridAction which is the action result from the brain
 * @interface GridAction implements the functions which return the logic decision from the brain as well as the efficiency.
 * @file also contains @interface SupplyingPath which contains the key-value pair what action should be taken by the grid
 * 
 * @summary the file holds an interface for action which is returned by the brain
 * @author Lev Stambler <levst@google.com>
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 6/26/2020, 10:20:42 AM
 * Last modified  : 7/28/2020, 2:55:00 PM
 */

// Createas a path/edge of the graph which shows where to supply energy and from where
// { supplyTo: supplyFrom}
// supplyTo and supplyFrom are names of gridItems
export interface SupplyingPath {
  [string: string]: string;
}

export interface GridAction {
  getSupplyingPaths: () => SupplyingPath;
  getEfficiency: () => number;
}
