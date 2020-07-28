/**
 * @file contains defines @interface GridItem which represents items that can be connected to the state graph
 * Each @interface GridItem contains @param gridItemName which is unique to that item, as well as
 * @param gridItemResistance which is the electrical resistance for the item
 *
 * @summary the file holds an interface for action which is returned by the brain
 * @author Lev Stambler <levst@google.com>
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 7/14/2020, 7:24:31 AM
 * Last modified  : 7/28/2020, 3:02:05 PM
 */

import { ItemPosition } from '../measurements';

/**
 * A grid item is on a grid, and its relativePosition is relative
 * to the top left corner of the grid
 */
export interface GridItem {
  readonly gridItemName: string;
  readonly gridItemResistance: number;
  getRelativePosition: () => ItemPosition;
}
