import {
  Grid,
  GridAction,
  GridOptions,
  Town,
  TownSize,
  ItemPosition,
  Energy,
  Battery,
} from '@biogrid/grid-simulator';
import { BiogridState } from '../biogrid-state';
import { BioBattery } from '../biobattery';

export interface BiogridOptions extends GridOptions {
  numberOfSmallBatteryCells: number;
  numberOfLargeBatteryCells: number;
}

export class Biogrid implements Grid {
  private state: BiogridState;

  // All details for the batteries in the grid
  // The small batteries in the grid, will approximately have a maxCapacity of 13,500KJ
  private smallBatteries: Battery[];
  private smallMaxCapacity = 13500;
  // The large batteries in the grid, will approximately have a maxCapacity of 540,000KJ
  private largeBatteries: Battery[] = [];
  private largeMaxCapacity = 13500;
  // Initial energy for all the batteries is set to 0KJ
  private initialCapacity = 0;

  // All details for the houses / energyUsers in the grid
  private townsize: TownSize;

  
  constructor(town: Town, opts: BiogridOptions) {
    const smallBatteryPositions = this.createBatteryPositions(town.getTownSize(), opts.numberOfSmallBatteryCells);
    const largeBatteryPositions = this.createBatteryPositions(town.getTownSize(), opts.numberOfLargeBatteryCells);
    // TODO constants
    this.smallBatteries = this.createSmallBatteries(smallBatteryPositions);
    this.largeBatteries = this.createLargeBatteries(largeBatteryPositions);

    this.state = new BiogridState([]);
  }

  getSystemState(): BiogridState {
    return this.state;
  }

  private createSmallBatteries(positions: ItemPosition[]): Battery[] {
    return positions.map(position => new BioBattery(position.x, position.y, this.initialCapacity, this.smallMaxCapacity));
  }

  private createLargeBatteries(positions: ItemPosition[]): Battery[] {
    return positions.map(position => new BioBattery(position.x, position.y, this.initialCapacity, this.largeMaxCapacity));
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
