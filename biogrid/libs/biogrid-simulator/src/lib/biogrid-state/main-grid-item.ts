/**
 * @summary is a class which defines the grid which is always in the middle of the town
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 7/31/2020, 11:50:42 AM
 * Last modified  : 7/29/2020, 11:58:17 AM
 */

import { GridItem, ItemPosition, TownSize } from '@biogrid/grid-simulator';
import { GRID_ITEM_NAMES, RESISTANCE } from '../config';

export class MAIN_GRID implements GridItem {
  gridItemName: string = GRID_ITEM_NAMES.GRID;
  gridItemResistance: number = RESISTANCE.GRID;
  // 
  private readonly relativePosition: ItemPosition
  constructor(townSize: TownSize) {
    // Add the grid in the center of the town based on the townSize
    this.relativePosition = {
      x: Math.floor(townSize.width / 2),
      y: Math.floor(townSize.height / 2),
    }
  }

  getRelativePosition() {
    return this.relativePosition;
  }
}
