import {
  Grid,
  GridAction,
  GridOptions,
  Town,
  TownSize,
  ItemPosition,
} from '@biogrid/grid-simulator';
import { BiogridState } from '../biogrid-state';
import { BioBattery } from '../biobattery';

export interface BiogridOptions extends GridOptions {
  numberOfSmallBatteryCells: number;
  numberOfLargeBatteryCells: number;
}

export class Biogrid implements Grid {
  private state: BiogridState;
  constructor(town: Town, opts: BiogridOptions) {
    const smallBatteryPositions = this.createBatteryPositions(town.getTownSize(), opts.numberOfSmallBatteryCells);
    const largeBatteryPositions = this.createBatteryPositions(town.getTownSize(), opts.numberOfLargeBatteryCells);
    // TODO constants
    const smallBatteries = smallBatteryPositions.map(pos => new BioBattery(pos.x, pos.y, 0, 100))
    this.state = new BiogridState([]);
  }

  getSystemState(): BiogridState {
    return this.state;
  }

  takeAction(action: GridAction) {
    // TODO implement actions taken later
    return;
  }

  /**
   * A simplified algorithm to (mostly) evenly space out batteries throughout the square town
   * Split the town into rows and columns and then place a battery in the center of each cell
   */
  private createBatteryPositions(townSize: TownSize, numberOfBatteries: number): ItemPosition[] {
    const cols = Math.ceil(numberOfBatteries / townSize.width);
    const rows = numberOfBatteries / cols;
    const positions: ItemPosition[] = [];
    for (let i = 0; i < numberOfBatteries; i++) {
      positions.push({
        x: ((numberOfBatteries % cols + 0.5) / cols) * townSize.width,
        y: ((Math.floor(i / cols) + 0.5) / rows) * townSize.height
      })
    }
    return positions
  }
}
