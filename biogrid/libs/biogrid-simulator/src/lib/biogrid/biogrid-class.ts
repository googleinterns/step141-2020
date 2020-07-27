import {
  Grid,
  GridAction,
  GridOptions,
  Town,
  TownSize,
  ItemPosition,
  Energy,
  Battery,
  GridItem
} from '@biogrid/grid-simulator';
import { LARGE_BATTERY, SMALL_BATTERY, SOLAR_PANEL, GRID_ITEM_NAMES, RESISTANCE } from '../config';
import { 
  BioBattery, 
  BiogridState,
  Building,
  SolarPanel
} from '@biogrid/biogrid-simulator';
import { EnergySource } from '../bioenergy-source/bioenergy-source';

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

  // All details for the source of energy
  private solarPanels: EnergySource[];

  // Holds the efficiency of the grid
  private efficiency: number;

  constructor(private town: Town, opts: BiogridOptions) {

    // Batteries
    const smallBatteryPositions = this.createGridItemPositions(town.getTownSize(), opts.numberOfSmallBatteryCells);
    const largeBatteryPositions = this.createGridItemPositions(town.getTownSize(), opts.numberOfLargeBatteryCells);

    this.smallBatteries = this.createBatteries(
      smallBatteryPositions,
      GRID_ITEM_NAMES.SMALL_BATTERY
    );
    this.largeBatteries = this.createBatteries(
      largeBatteryPositions,
      GRID_ITEM_NAMES.LARGE_BATTERY
    );

    // Enery Source
    // TODO implement the solar panels
    const solarPanelPositions = this.createGridItemPositions(town.getTownSize(), opts.numberOfSolarPanels);
    this.solarPanels = this.createSolarPanels(solarPanelPositions);

    this.state = new BiogridState(this.createGridItems());
    // Set the effieciency to 0 at the beginning
    this.efficiency = 0;
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

  getEfficiency() {
    return this.efficiency;
  }

  getJsonGraphDetails() {
    return this.state.getJsonGraph();
  }

  private createBatteries(positions: ItemPosition[], gridItemName: string): Battery[] {
    const batteryResistance = gridItemName === GRID_ITEM_NAMES.LARGE_BATTERY
      ? RESISTANCE.LARGE_BATTERY
      : RESISTANCE.SMALL_BATTERY;
    const maxCapacity = gridItemName === GRID_ITEM_NAMES.LARGE_BATTERY
      ? LARGE_BATTERY.MAX_CAPACITY
      : SMALL_BATTERY.MAX_CAPACITY;
    const initEnergy = gridItemName === GRID_ITEM_NAMES.LARGE_BATTERY
      ? LARGE_BATTERY.DEFAULT_START_ENERGY
      : SMALL_BATTERY.DEFAULT_START_ENERGY;
    return positions.map(
      (position, index) => new BioBattery(position.x, position.y, `${gridItemName}-${index}`, batteryResistance, initEnergy, maxCapacity)
    );
  }

  /**
   * This method creates a list of solar panels placed depending on their positions
   * @param positions holds the positions where the solar panels are going to be placed
   */
  // TODO pass a list of equal length to hold the area for the solar panels
  private createSolarPanels(positions: ItemPosition[]): EnergySource[] {
    return positions.map(
      (position, index) => new SolarPanel(position.x, position.y, SOLAR_PANEL.AREA, `${GRID_ITEM_NAMES.SOLAR_PANEL}-${index}`)
    );
  }
  /**
   * This method takes the results of th brain and then it changes the state graph as suggested by the brain.
   * The results of the brain are in form of an object key:value pair, with the receiver gridItemName as key and supplier gridItemName as value
   * @param action holds the results from the brain
   * @returns a the current state with a new graph which includes the changes that were suggested by the brain
   */
  takeAction(action: GridAction) {
    // Set new efficiency
    this.efficiency = action.getEfficiency();
    // RETURN a new BiogridState
    const allSupplyingPaths = action.getSupplyingPaths();

    const clonedGraph = this.state.cloneStateGraph();
    for (const supplyPath in allSupplyingPaths) {
      const oldGridItem = this.state.getGridItem(supplyPath);
      const supplyingGridItem = this.state.getGridItem(allSupplyingPaths[supplyPath]);
      const typeOldGridItem = this.getGridItemType(oldGridItem);
      if (typeOldGridItem === GRID_ITEM_NAMES.ENERGY_USER) {
        const energyUser = oldGridItem as Building;
        const energyUserReq = energyUser.getMaxCapacity() - energyUser.getEnergyInJoules();
        const typeSupplyingGridItem = this.getGridItemType(supplyingGridItem);
        if (typeSupplyingGridItem === GRID_ITEM_NAMES.LARGE_BATTERY || typeSupplyingGridItem === GRID_ITEM_NAMES.SMALL_BATTERY) {
          const battery = supplyingGridItem as BioBattery;
          battery.supplyPower(energyUserReq);
          clonedGraph.setNode(battery.gridItemName, battery);
        } else if (typeSupplyingGridItem === GRID_ITEM_NAMES.SOLAR_PANEL) {
          const solarpanel = supplyingGridItem as SolarPanel;
          solarpanel.supplyPower(energyUserReq);
          clonedGraph.setNode(solarpanel.gridItemName, solarpanel);
        } else {
          continue;
        }
        energyUser.increaseEnergy(energyUserReq);
        clonedGraph.setNode(energyUser.gridItemName, energyUser);
      } else if (typeOldGridItem === GRID_ITEM_NAMES.SMALL_BATTERY) {
        const energyUser = oldGridItem as BioBattery;
        const energyUserReq = energyUser.getMaxCapacity() - energyUser.getEnergyInJoules();
        const typeSupplyingGridItem = this.getGridItemType(supplyingGridItem);
        if (typeSupplyingGridItem === GRID_ITEM_NAMES.LARGE_BATTERY) {
          const battery = supplyingGridItem as BioBattery;
          battery.supplyPower(energyUserReq);
          clonedGraph.setNode(battery.gridItemName, battery);
        } else if (typeSupplyingGridItem === GRID_ITEM_NAMES.SOLAR_PANEL) {
          const solarpanel = supplyingGridItem as SolarPanel;
          solarpanel.supplyPower(energyUserReq);
          clonedGraph.setNode(solarpanel.gridItemName, solarpanel);
        } else {
          continue;
        }
        energyUser.startCharging(energyUserReq);
        clonedGraph.setNode(energyUser.gridItemName, energyUser);
      } else if (typeOldGridItem === GRID_ITEM_NAMES.LARGE_BATTERY) {
        const energyUser = oldGridItem as BioBattery;
        const energyUserReq =
          energyUser.getMaxCapacity() - energyUser.getEnergyInJoules();
        const typeSupplyingGridItem = this.getGridItemType(supplyingGridItem);
        if (typeSupplyingGridItem === GRID_ITEM_NAMES.SOLAR_PANEL) {
          const solarpanel = supplyingGridItem as SolarPanel;
          solarpanel.supplyPower(energyUserReq);
        } else {
          continue;
        }
        energyUser.startCharging(energyUserReq);
        clonedGraph.setNode(energyUser.gridItemName, energyUser);
      }
    }
    this.state.setnewStateGraph(clonedGraph);
    return this.state;
  }

  private getGridItemType(gridItem: GridItem): string {
    if (gridItem.gridItemName.includes(GRID_ITEM_NAMES.ENERGY_USER)) {
      return GRID_ITEM_NAMES.ENERGY_USER;
    } else if (gridItem.gridItemName.includes(GRID_ITEM_NAMES.SMALL_BATTERY)) {
      return GRID_ITEM_NAMES.SMALL_BATTERY;
    } else if (gridItem.gridItemName.includes(GRID_ITEM_NAMES.LARGE_BATTERY)) {
      return GRID_ITEM_NAMES.LARGE_BATTERY;
    } else if (gridItem.gridItemName.includes(GRID_ITEM_NAMES.SOLAR_PANEL)) {
      return GRID_ITEM_NAMES.SOLAR_PANEL;
    }
    return GRID_ITEM_NAMES.GRID;
  }

  /**
   * A simplified algorithm to (mostly) evenly space out batteries throughout the square town
   * Split the town into rows and columns and then place a battery in the center of each cell
   * TODO: have a smart algorithm for placement, see https://github.com/googleinterns/step141-2020/issues/42
   */
  private createGridItemPositions(
    townSize: TownSize,
    numberOfGridItems: number
  ): ItemPosition[] {
    const cols = Math.ceil(numberOfGridItems / townSize.width);
    const rows = Math.ceil(numberOfGridItems / cols);
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
