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
  Distance,
} from '@biogrid/grid-simulator';
import * as bioconstants from '../config/bio-constants';
import {
  BioBattery,
  BiogridState,
  Building,
  SolarPanel,
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

  // A dictionary with the position as its key
  // Used to keep track of whether an item is already placed in a position
  private itemInPosition: { [positionString: string]: boolean } = {};

  // All details for the houses / energyUsers in the grid
  private town: Town;

  // All details for the source of energy
  private solarPanels: EnergySource[];

  constructor(town: Town, opts: BiogridOptions) {
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

    // Towns
    this.town = town;

    // Enery Source
    // TODO implement the solar panels
    const solarPanelPositions = this.createGridItemPositions(
      town.getTownSize(),
      opts.numberOfSolarPanels
    );
    this.solarPanels = this.createSolarPanels(solarPanelPositions);

    this.state = new BiogridState(this.createGridItems());
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
          xPos: position.x,
          yPos: position.y,
          id: `${gridItemName}-${index}`,
          resistance: batteryResistance,
          initialEnergyInJoules: initEnergy,
          maxCapacityInJoules: maxCapacity,
        })
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
        new SolarPanel(
          position.x,
          position.y,
          bioconstants.SOLAR_PANEL.AREA,
          `${bioconstants.GRID_ITEM_NAMES.SOLAR_PANEL}-${index}`
        )
    );
  }
  /**
   * This method takes the results of th brain and then it changes the state graph as suggested by the brain.
   * The results of the brain are in form of an object key:value pair, with the receiver gridItemName as key and supplier gridItemName as value
   * @param action holds the results from the brain
   * @returns a the current state with a new graph which includes the changes that were suggested by the brain
   */
  takeAction(action: GridAction) {
    // RETURN a new BiogridState
    const allSupplyingPaths = action.getSupplyingPaths();

    const clonedGraph = this.state.cloneStateGraph();

    for (const supplyPath in allSupplyingPaths) {
      const oldGridItem = this.state.getGridItem(supplyPath);
      const supplyingGridItem = this.state.getGridItem(
        allSupplyingPaths[supplyPath]
      );
      const typeOldGridItem = this.getGridItemType(oldGridItem);
      if (typeOldGridItem === bioconstants.GRID_ITEM_NAMES.ENERGY_USER) {
        const energyUser = oldGridItem as Building;
        const energyUserReq =
          energyUser.getMaxCapacity() - energyUser.getEnergyInJoules();
        const typeSupplyingGridItem = this.getGridItemType(supplyingGridItem);
        if (
          typeSupplyingGridItem ===
            bioconstants.GRID_ITEM_NAMES.LARGE_BATTERY ||
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
        energyUser.increaseEnergy(energyUserReq);
        clonedGraph.setNode(energyUser.gridItemName, energyUser);
      } else if (
        typeOldGridItem === bioconstants.GRID_ITEM_NAMES.SMALL_BATTERY
      ) {
        const energyUser = oldGridItem as BioBattery;
        const energyUserReq =
          energyUser.getMaxCapacity() - energyUser.getEnergyInJoules();
        const typeSupplyingGridItem = this.getGridItemType(supplyingGridItem);
        if (
          typeSupplyingGridItem === bioconstants.GRID_ITEM_NAMES.LARGE_BATTERY
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
        energyUser.startCharging(energyUserReq);
        clonedGraph.setNode(energyUser.gridItemName, energyUser);
      } else if (
        typeOldGridItem === bioconstants.GRID_ITEM_NAMES.LARGE_BATTERY
      ) {
        const energyUser = oldGridItem as BioBattery;
        const energyUserReq =
          energyUser.getMaxCapacity() - energyUser.getEnergyInJoules();
        const typeSupplyingGridItem = this.getGridItemType(supplyingGridItem);
        if (
          typeSupplyingGridItem === bioconstants.GRID_ITEM_NAMES.SOLAR_PANEL
        ) {
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
