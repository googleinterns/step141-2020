import {
  Grid,
  GridAction,
  GridOptions,
  Town,
  TownSize,
  ItemPosition,
  Energy,
  Battery,
  EnergySource,
} from '@biogrid/grid-simulator';
import { BiogridState } from '../biogrid-state';
import { BioBattery } from '../biobattery';
import { GridItem } from 'libs/grid-simulator/src/lib/grid-item';
import { BioEnergySource } from '../bioenergy-source';
import { LARGE_BATTERY, SMALL_BATTERY, SOLAR_PANEL, GRID_ITEM_NAMES } from '../config';

export interface BiogridOptions extends GridOptions {
  numberOfSmallBatteryCells: number;
  numberOfLargeBatteryCells: number;
  numberOfSolarPanels: number;
}

export class Biogrid implements Grid {
  // TODO create a singleton for the Biogrid not BiogridState
  private state: BiogridState;

  // All details for the batteries in the grid
  // The small batteries in the grid, will approximately have a maxCapacity of 13,500KJ
  private smallBatteries: Battery[];
  // The large batteries in the grid, will approximately have a maxCapacity of 540,000KJ
  private largeBatteries: Battery[];

  // All details for the houses / energyUsers in the grid
  private town: Town;

  // All details for the source of energy
  private solarPanels: EnergySource[];

  
  constructor(town: Town, opts: BiogridOptions) {

    // Batteries
    // TODO implement this outside when calling the grid
    const smallBatteryPositions = this.createGridItemPositions(town.getTownSize(), opts.numberOfSmallBatteryCells);
    const largeBatteryPositions = this.createGridItemPositions(town.getTownSize(), opts.numberOfLargeBatteryCells);
    // TODO constants
    this.smallBatteries = this.createBatteries(smallBatteryPositions, SMALL_BATTERY.DEFAULT_START_ENERGY, SMALL_BATTERY.MAX_CAPACITY, GRID_ITEM_NAMES.SMALL_BATTERY);
    this.largeBatteries = this.createBatteries(largeBatteryPositions, LARGE_BATTERY.DEFAULT_START_ENERGY, LARGE_BATTERY.MAX_CAPACITY, GRID_ITEM_NAMES.LARGE_BATTERY);

    // Towns
    this.town = town;

    // Enery Source
    // TODO implement the solar panels
    const solarPanelPositions = this.createGridItemPositions(town.getTownSize(), opts.numberOfSolarPanels);
    this.solarPanels = this.createSolarPanels(solarPanelPositions);
    
    this.state = new BiogridState(this.createGridItems());

  }

  private createGridItems(): GridItem[] {
    return [
      ...this.smallBatteries,
      ...this.largeBatteries,
      ...this.town.getEnergyUsers(),
      ...this.solarPanels,
    ]
  }

  getSystemState() {
    return this.state;
  }

  private createBatteries(positions: ItemPosition[], initEnergy: Energy, maxCapacity: Energy, name: string): Battery[] {
    return positions.map((position, index) => new BioBattery(position.x, position.y, `${name}-${index}`, initEnergy, maxCapacity));
  }

  private createSolarPanels(positions: ItemPosition[]): EnergySource[] {
    return positions.map((position, index) => new BioEnergySource(position.x, position.y, `${GRID_ITEM_NAMES.SOLAR_PANEL}-${index}`, SOLAR_PANEL.DEFAULT_INITIAL_ENERGY, SOLAR_PANEL.MIN_CAPACITY))
  }

  takeAction(action: GridAction) {
    // TODO implement actions taken later
    // RETURN a new BiogridState
    
    return;
  }

  /**
   * A simplified algorithm to (mostly) evenly space out gridItems throughout the square town
   * Split the town into rows and columns and then place a gridItem in the center of each cell
   */
  private createGridItemPositions(
    townSize: TownSize,
    numberOfGridItems: number
  ): ItemPosition[] {
    const cols = Math.ceil(numberOfGridItems / townSize.width);
    const rows = numberOfGridItems / cols;
    const positions: ItemPosition[] = [];
    for (let i = 0; i < numberOfGridItems; i++) {
      positions.push({
        x: (((i % cols) + 0.5) / cols) * townSize.width,
        y: ((Math.floor(i / cols) + 0.5) / rows) * townSize.height,
      });
    }
    return positions;
  }
}
