import {
  Grid,
  GridAction,
  GridOptions,
  Town,
  TownSize,
  ItemPosition,
  Energy,
  Battery,
  GridItem,
  Power,
  Distance
} from '@biogrid/grid-simulator';
import * as bioconstants from '../config/bio-constants';
import {
  BioBattery,
  BiogridState,
  Building,
  SolarPanel,
  SolarPanelParams,
} from '@biogrid/biogrid-simulator';
import { Graph } from 'graphlib';
import { EnergySource } from '../bioenergy-source/bioenergy-source';
import { BatteryParams } from '../biobattery';

export interface BiogridOptions extends GridOptions {
  numberOfSmallBatteryCells: number;
  numberOfLargeBatteryCells: number;
  numberOfSolarPanels: number;
  startDate?: Date;
}

export class Biogrid implements Grid {
  // TODO create a singleton for the Biogrid not BiogridState
  private state: BiogridState;

  private startDate: Date;

  // All details for the batteries in the grid
  // The small batteries in the grid, will approximately have a maxCapacity of 13,500KJ
  private smallBatteries: Battery[];
  // The large batteries in the grid, will approximately have a maxCapacity of 540,000KJ
  private largeBatteries: Battery[];

  // A dictionary with the position as its key
  // Used to keep track of whether an item is already placed in a position
  private itemInPosition: { [positionString: string]: boolean } = {};
  // All details for the source of energy
  private solarPanels: EnergySource[];

  // Holds the efficiency of the grid
  private efficiency: number;

  constructor(private town: Town, opts: BiogridOptions) {
    const todayMidnight = new Date();
    todayMidnight.setHours(0);
    this.startDate = opts.startDate || todayMidnight;
    // Batteries
    const smallBatteryPositions = this.createGridItemPositions(
      town.getTownSize(),
      opts.numberOfSmallBatteryCells
    );
    const largeBatteryPositions = this.createGridItemPositions(
      town.getTownSize(),
      opts.numberOfLargeBatteryCells
    );

    this.smallBatteries = this.createBatteries(
      smallBatteryPositions,
      bioconstants.GRID_ITEM_NAMES.SMALL_BATTERY
    );
    this.largeBatteries = this.createBatteries(
      largeBatteryPositions,
      bioconstants.GRID_ITEM_NAMES.LARGE_BATTERY
    );

    // Energy Source
    // TODO implement the solar panels
    const solarPanelPositions = this.createGridItemPositions(
      town.getTownSize(),
      opts.numberOfSolarPanels
    );
    this.solarPanels = this.createSolarPanels(solarPanelPositions);

    this.state = new BiogridState(this.createGridItems(), town.getTownSize());
    // Set the effieciency to 0 at the beginning
    this.efficiency = 0;
  }

  private createGridItems(): GridItem[] {
    return [
      ...this.smallBatteries,
      ...this.largeBatteries,
      ...this.town.getEnergyUsers(),
      ...this.solarPanels,
    ];
  }

  getTownSize() {
    return this.town.getTownSize();
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

  private createBatteries(
    positions: ItemPosition[],
    gridItemName: string
  ): Battery[] {
    const batteryResistance =
      gridItemName === bioconstants.GRID_ITEM_NAMES.LARGE_BATTERY
        ? bioconstants.RESISTANCE.LARGE_BATTERY
        : bioconstants.RESISTANCE.SMALL_BATTERY;
    const maxCapacity =
      gridItemName === bioconstants.GRID_ITEM_NAMES.LARGE_BATTERY
        ? bioconstants.LARGE_BATTERY.MAX_CAPACITY
        : bioconstants.SMALL_BATTERY.MAX_CAPACITY;
    const initEnergy =
      gridItemName === bioconstants.GRID_ITEM_NAMES.LARGE_BATTERY
        ? bioconstants.LARGE_BATTERY.DEFAULT_START_ENERGY
        : bioconstants.SMALL_BATTERY.DEFAULT_START_ENERGY;
    return positions.map(
      (position, index) =>
        new BioBattery({
          x: position.x,
          y: position.y,
          gridItemName: `${gridItemName}-${index}`,
          gridItemResistance: batteryResistance,
          energyInJoules: initEnergy,
          maxCapacity,
        } as BatteryParams)
    );
  }

  /**
   * This method creates a list of solar panels placed depending on their positions
   * @param positions holds the positions where the solar panels are going to be placed
   */
  // TODO pass a list of equal length to hold the area for the solar panels
  private createSolarPanels(positions: ItemPosition[]): EnergySource[] {
    return positions.map(
      (position, index) =>
        new SolarPanel({
          x: position.x,
          y: position.y,
          efficiency: 0.75,
          areaSquareMeters: bioconstants.SOLAR_PANEL.AREA,
          gridItemName: `${bioconstants.GRID_ITEM_NAMES.SOLAR_PANEL}-${index}`,
          date: this.startDate,
        } as SolarPanelParams)
    );
  }

  /**
   * Drain the energy users according to the time of day
   */
  drainEnergyUsers(date: Date) {
    this.town.getEnergyUsers().forEach((energyUser) => {
      energyUser.decreaseEnergyAccordingToTimeOfDay(date);
    });
  }

  /**
   * This method takes the results of th brain and then it changes the state graph as suggested by the brain.
   * The results of the brain are in form of an object key:value pair, with the receiver gridItemName as key and supplier gridItemName as value
   * @param action holds the results from the brain
   * @returns a the current state with a new graph which includes the changes that were suggested by the brain
   */
  takeAction(action: GridAction) {
    const powerEdges: { v: string; w: string; power: Power }[] = [];
    // Set new efficiency
    this.efficiency = action.getEfficiency();
    // RETURN a new BiogridState
    const allSupplyingPaths = action.getSupplyingPaths();
    this.state.resetPowerOnEdges();
    const clonedGraph = this.state.cloneStateGraph();
    for (const supplyPath in allSupplyingPaths) {
      const oldGridItem = this.state.getGridItem(supplyPath);
      // take energy from the supplying grid item and transfer it to the energy user
      const supplyingGridItem = this.state.getGridItem(
        allSupplyingPaths[supplyPath]
      );
      const typeOldGridItem = this.getGridItemType(oldGridItem);
      const energyUser = oldGridItem as Building | BioBattery;
      const energyUserReq =
        energyUser.getMaxCapacity() - energyUser.getEnergyInJoules();
      const typeSupplyingGridItem = this.getGridItemType(supplyingGridItem);
      if (typeOldGridItem === bioconstants.GRID_ITEM_NAMES.ENERGY_USER) {
        if (
          typeSupplyingGridItem === bioconstants.GRID_ITEM_NAMES.LARGE_BATTERY ||
          typeSupplyingGridItem === bioconstants.GRID_ITEM_NAMES.SMALL_BATTERY
        ) {
          const battery = supplyingGridItem as BioBattery;
          battery.supplyPower(energyUserReq);
          clonedGraph.setNode(battery.gridItemName, battery);
        } else if (
          typeSupplyingGridItem === bioconstants.GRID_ITEM_NAMES.SOLAR_PANEL
        ) {
          const solarpanel = supplyingGridItem as SolarPanel;
          solarpanel.supplyPower(energyUserReq);
          clonedGraph.setNode(solarpanel.gridItemName, solarpanel);
        } else {
          continue;
        }
        (energyUser as Building).increaseEnergy(energyUserReq);
        clonedGraph.setNode(energyUser.gridItemName, energyUser);
      } else if (typeOldGridItem === bioconstants.GRID_ITEM_NAMES.SMALL_BATTERY) {
        if (typeSupplyingGridItem === bioconstants.GRID_ITEM_NAMES.LARGE_BATTERY) {
          const battery = supplyingGridItem as BioBattery;
          battery.supplyPower(energyUserReq);
          clonedGraph.setNode(battery.gridItemName, battery);
        } else if (
          typeSupplyingGridItem === bioconstants.GRID_ITEM_NAMES.SOLAR_PANEL
        ) {
          const solarpanel = supplyingGridItem as SolarPanel;
          solarpanel.supplyPower(energyUserReq);
          clonedGraph.setNode(solarpanel.gridItemName, solarpanel);
        } else {
          continue;
        }
        (energyUser as BioBattery).startCharging(energyUserReq);
        clonedGraph.setNode(energyUser.gridItemName, energyUser);
      } else if (typeOldGridItem === bioconstants.GRID_ITEM_NAMES.LARGE_BATTERY) {
        if (typeSupplyingGridItem === bioconstants.GRID_ITEM_NAMES.SOLAR_PANEL) {
          const solarpanel = supplyingGridItem as SolarPanel;
          solarpanel.supplyPower(energyUserReq);
        } else {
          continue;
        }
        (energyUser as BioBattery).startCharging(energyUserReq);
        clonedGraph.setNode(energyUser.gridItemName, energyUser);
      }
      powerEdges.push({
        v: supplyingGridItem.gridItemName,
        w: energyUser.gridItemName,
        // convert kilowatthours into kilowatts
        power: energyUserReq / bioconstants.TIME.DISCRETE_UNIT_HOURS,
      });
    }
    this.state.setnewStateGraph(clonedGraph);
    powerEdges.forEach((powerEdge) => {
      this.state.setPowerBetweenNodes(
        powerEdge.v,
        powerEdge.w,
        powerEdge.power
      );
    });
    return this.state;
  }

  private getGridItemType(gridItem: GridItem): string {
    if (
      gridItem.gridItemName.includes(bioconstants.GRID_ITEM_NAMES.ENERGY_USER)
    ) {
      return bioconstants.GRID_ITEM_NAMES.ENERGY_USER;
    } else if (
      gridItem.gridItemName.includes(bioconstants.GRID_ITEM_NAMES.SMALL_BATTERY)
    ) {
      return bioconstants.GRID_ITEM_NAMES.SMALL_BATTERY;
    } else if (
      gridItem.gridItemName.includes(bioconstants.GRID_ITEM_NAMES.LARGE_BATTERY)
    ) {
      return bioconstants.GRID_ITEM_NAMES.LARGE_BATTERY;
    } else if (
      gridItem.gridItemName.includes(bioconstants.GRID_ITEM_NAMES.SOLAR_PANEL)
    ) {
      return bioconstants.GRID_ITEM_NAMES.SOLAR_PANEL;
    }
    return bioconstants.GRID_ITEM_NAMES.GRID;
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
      const newPositionUnverified = {
        x: this.roundToGridDistance(
          (((i % cols) + 0.5) / cols) * townSize.width
        ),
        y: this.roundToGridDistance(
          ((Math.floor(i / cols) + 0.5) / rows) * townSize.height
        ),
      };
      const newPosition = this.findNearestUnoccupiedPosition(
        newPositionUnverified,
        townSize
      );
      positions.push(newPosition);
      this.itemInPosition[this.formatItemPosition(newPosition)] = true;
    }
    return positions;
  }

  /**
   * Find the nearest unoccupied position to {@code pos} by looking looking in a spiral with pos at its center
   * First the space immediately right of pos is checked, then the one above, then to the left, then below, then two right spaces out, two right up, etc
   */
  private findNearestUnoccupiedPosition(
    pos: ItemPosition,
    townSize: TownSize
  ): ItemPosition {
    let radius = bioconstants.GRID_DISTANCES.INCREMENTS_KM;
    let angle = 0;
    let outOfBoundsCount = 0;
    let xOffset = 0,
      yOffset = 0;
    let newPos = { x: pos.x + xOffset, y: pos.y + yOffset };
    // If {@code outOfBoundsCount} is greater than 3, then that means the upwards, left, right, and down
    // Are all out of bounds. Thus there is no where left to place the item
    while (
      (this.positionOutOfBounds(newPos, townSize) ||
        this.positionOccupied(newPos)) &&
      outOfBoundsCount < 4
    ) {
      if (this.positionOutOfBounds(newPos, townSize)) {
        outOfBoundsCount++;
      }
      switch (angle) {
        case 0:
          yOffset = 0;
          xOffset = radius;
          break;
        case 90:
          xOffset = 0;
          yOffset = radius;
          break;
        case 180:
          xOffset = -1 * radius;
          yOffset = 0;
          break;
        case 270:
          xOffset = 0;
          yOffset = -1 * radius;
          break;
      }
      newPos = { x: pos.x + xOffset, y: pos.y + yOffset };
      // Increment the angle by 90 degrees
      angle = angle + 90;
      if (angle === 360) {
        radius += bioconstants.GRID_DISTANCES.INCREMENTS_KM;
        // Reset the angle
        angle = 0;
      }
    }
    if (outOfBoundsCount > 3) {
      throw new Error(
        `There are too many items on the grid. New items could not be placed with a minimum distance of ${bioconstants.GRID_DISTANCES.INCREMENTS_KM} km apart`
      );
    }
    return newPos;
  }

  private positionOutOfBounds(pos: ItemPosition, townSize: TownSize): boolean {
    return pos.x > townSize.width || pos.y > townSize.height;
  }

  private roundToGridDistance(distance: Distance): Distance {
    return (
      Math.floor(distance / bioconstants.GRID_DISTANCES.INCREMENTS_KM) *
      bioconstants.GRID_DISTANCES.INCREMENTS_KM
    );
  }

  private positionOccupied(pos: ItemPosition): boolean {
    return this.itemInPosition[this.formatItemPosition(pos)];
  }

  /**
   * Convert an item into a string
   */
  private formatItemPosition(pos: ItemPosition): string {
    return `${pos.x}, ${pos.y}`;
  }
}
