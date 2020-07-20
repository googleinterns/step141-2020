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
    const smallBatteryPositions = this.createBatteryPositions(
      town.getTownSize(),
      opts.numberOfSmallBatteryCells
    );
    const largeBatteryPositions = this.createBatteryPositions(
      town.getTownSize(),
      opts.numberOfLargeBatteryCells
    );
    const smallBatteries = smallBatteryPositions.map(
      (pos) => new BioBattery(pos.x, pos.y)
    );
    const largeBatteries = largeBatteryPositions.map(
      (pos) => new BioBattery(pos.x, pos.y)
    );
    this.state = new BiogridState([
      ...smallBatteries,
      ...largeBatteries,
      ...town.getEnergyUsers(),
    ]);
    this.state.convertStateGraphToMST();
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
   * TODO: have a smart algorithm for placement, see https://github.com/googleinterns/step141-2020/issues/42
   */
  private createBatteryPositions(
    townSize: TownSize,
    numberOfBatteries: number
  ): ItemPosition[] {
    const cols = Math.ceil(numberOfBatteries / townSize.width);
    const rows = Math.ceil(numberOfBatteries / cols);
    const positions: ItemPosition[] = [];
    for (let i = 0; i < numberOfBatteries; i++) {
      positions.push({
        x: (((i % cols) + 0.5) / cols) * townSize.width,
        y: ((Math.floor(i / cols) + 0.5) / rows) * townSize.height,
      });
    }
    return positions;
  }
}
