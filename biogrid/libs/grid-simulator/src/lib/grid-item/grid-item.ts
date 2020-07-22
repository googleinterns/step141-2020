import { ItemPosition } from '../measurements';

/**
 * A grid item is on a grid, and its relativePosition is relative
 * to the top left corner of the grid
 */
export interface GridItem {
  readonly gridItemName: string;
  getRelativePosition: () => ItemPosition;
}
