/**
 * @file defines the @class BioBrain which describes the brain of the grid responsible for deciding what action the grid should take.
 * It @implements @interface Brain which add the functionalities the brain
 * This class implements a singleton of the Brain since the grid only has one brain. it also implements:
 * 1. @method computeAction which computes the decisions on how the power should be supplied. It takes in the state graph and 
 * determines which grid item requires power and which one can supply it. It does the computations while minimizing the distance to
 * be travelled to transport this power so that it minimizes power leakages
 * 2. It also calculates @param efficiency, which is inversely proportional to power loss in the grid
 *
 * @summary is a class which defines the brain of the grid
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 6/29/2020, 4:33:42 PM
 * Last modified  : 7/29/2020, 10:21:17 AM
 */
import {
  Brain,
  GridAction,
  StateGraph,
  SupplyingPath,
  GridItem,
  Power
} from '@biogrid/grid-simulator';
import {
  BiogridAction,
  Building,
  BioBattery
} from '@biogrid/biogrid-simulator';
import * as config from '../config';
import { Path, Graph } from 'graphlib';
import { SolarPanel } from '../bioenergy-source';


interface gridItemsList {
  [config.GRID_ITEM_NAMES.ENERGY_USER]: Building[], 
  [config.GRID_ITEM_NAMES.SMALL_BATTERY]: BioBattery[], 
  [config.GRID_ITEM_NAMES.LARGE_BATTERY]: BioBattery[], 
  [config.GRID_ITEM_NAMES.SOLAR_PANEL]: SolarPanel[]
}

interface ResultingSupplyingPath {
  supplyingPath: SupplyingPath,
  inputPower: Power,
  outputPower: Power,
}

// We can only have one BioBrain per grid
export class BioBrain implements Brain {
  private static instance: BioBrain;
  private clonedGraph: Graph = new Graph();
  private constructor() {}

  // Access the singleton of the Brain
  static get Instance(): BioBrain {
    if (!this.instance) {
      this.instance = new BioBrain();
    }
    return this.instance;
  }

  async computeAction(state: StateGraph): Promise<GridAction> {
    // TODO calculate the efficiency for every transportation of power
    // Get the shortest distances between each gridItem to the rest of the gridItems
    const shortestDistances = state.getShortestDistances();

    // Create a clone of the graph becfore using it
    this.clonedGraph = state.cloneStateGraph();

    // Create an object of buildings with the energyProviders which supplied
    const buildingSuppliers: ResultingSupplyingPath = await this.chargeBuildings(
      shortestDistances
    );

    // Create an object of smallBatteries with the energyProviders which supplied
    const smallBatterySupplier: ResultingSupplyingPath = await this.chargeSmallBatteries(
      shortestDistances
    );
    // Create an object of largeBatteries with the energyProviders which supplied
    const largeBatterySupplier: ResultingSupplyingPath = await this.chargeLargebatteries(
      shortestDistances
    );
    const totalPowerInput = this.calculateTotalInputPower(
      buildingSuppliers.inputPower,
      smallBatterySupplier.inputPower,
      largeBatterySupplier.inputPower
    );

    const totalPowerOutput = this.calculateTotalOutputPower(
      buildingSuppliers.outputPower,
      smallBatterySupplier.outputPower,
      largeBatterySupplier.outputPower
    );

    const efficiency = config.calculateEfficiency(totalPowerInput, totalPowerOutput);
    return new BiogridAction({
      ...buildingSuppliers.supplyingPath,
      ...smallBatterySupplier.supplyingPath,
      ...largeBatterySupplier.supplyingPath
    }, 
      efficiency
    );
  }

  private calculateTotalInputPower(buildingInput: Power, sBatteryInput: Power, lBatteryInput: Power) {
    return (buildingInput + sBatteryInput + lBatteryInput);
  }

  private calculateTotalOutputPower(buildingOutput: Power, sBatteryOutput: Power, lBatteryOutput: Power) {
    return (buildingOutput + sBatteryOutput + lBatteryOutput);
  }

  /**
   * This method gets the different griditems and places them in their respective classes
   * This is implemented from the cloned graph so that we can change the items without
   * changing the original state graph as well as keeping track of which supplying grid
   * item has given off power so that one doesn't call the same grid items and then get
   * an error as the item might not have energy in it
   * @returns an object of key-value pair @enum GRID_ITEM_NAMES : respective grid items list
   */
  private getGridItems(): gridItemsList {
    let buildings: Building[] = [];
    let smallBatteries: BioBattery[] = [];
    let largeBatteries: BioBattery[] = [];
    let solarPanels: SolarPanel[] = [];

    const allGridItems = this.clonedGraph.nodes();
    // TODO: Implement with instanceof
    // @see https://github.com/googleinterns/step141-2020/issues/54
    allGridItems.map((item) => {
      const gridItem = this.clonedGraph.node(item);
      if (gridItem.gridItemName.includes(config.GRID_ITEM_NAMES.ENERGY_USER)) {
        buildings.push(gridItem as Building);
      } else if (gridItem.gridItemName.includes(config.GRID_ITEM_NAMES.SMALL_BATTERY)) {
        smallBatteries.push(gridItem as BioBattery);
      } else if (gridItem.gridItemName.includes(config.GRID_ITEM_NAMES.LARGE_BATTERY)) {
        largeBatteries.push(gridItem as BioBattery);
      } else if (gridItem.gridItemName.includes(config.GRID_ITEM_NAMES.SOLAR_PANEL)) {
        solarPanels.push(gridItem as SolarPanel);
      }
    });

    return {
      [config.GRID_ITEM_NAMES.ENERGY_USER]: buildings,
      [config.GRID_ITEM_NAMES.SMALL_BATTERY]: smallBatteries,
      [config.GRID_ITEM_NAMES.LARGE_BATTERY]: largeBatteries,
      [config.GRID_ITEM_NAMES.SOLAR_PANEL]: solarPanels
    };
  }

  /**
   * This method is used for charging individual largeBatteries which might not have enough energy
   * It calls the @method determineSupplyingPath which calculates which supplier can give these large batteries power
   * @returns @interface ResultingSupplyingPath which holds a key value pair of @interface supplyingPath requesting mapping to
   * the one which can supplying, powerInput, and powerOutput
   */
  private async chargeLargebatteries(
    shortestDistances: {[source: string]: { [node: string]: Path}}
  ): Promise<ResultingSupplyingPath> {
    const gridItems = this.getGridItems();
    let largeBatteries: BioBattery[] = gridItems[config.GRID_ITEM_NAMES.LARGE_BATTERY];
    let solarPanels: SolarPanel[] = gridItems[config.GRID_ITEM_NAMES.SOLAR_PANEL];
    // Assuming the large battery is not fully charged
    largeBatteries = largeBatteries.filter((battery) => !battery.isFull());

    // Filter the solar panels and remove the ones with the minimum energy or empty
    const solarPanelsFiltered = await this.filterSolarPanelsByEnergyAmount(solarPanels)

    // Create an array of the possible energy givers
    const allEnergyProviders = [...solarPanelsFiltered];

    return await this.determineSupplyingPath(largeBatteries, allEnergyProviders, shortestDistances);
  }

  /**
   * This method is used for charging individual smallBatteries which might not have energy energy
   * It calls the @method determineSupplyingPath which calculates which supplier can give these small batteries power
   * @returns @interface ResultingSupplyingPath which holds a key value pair of @interface supplyingPath requesting mapping to
   * the one which can supplying, powerInput, and powerOutput
   */
  private async chargeSmallBatteries(
    shortestDistances: {[source: string]: { [node: string]: Path}}
  ): Promise<ResultingSupplyingPath> {
    const gridItems = this.getGridItems();
    let smallBatteries: BioBattery[] = gridItems[config.GRID_ITEM_NAMES.SMALL_BATTERY];
    let largeBatteries: BioBattery[] = gridItems[config.GRID_ITEM_NAMES.LARGE_BATTERY];
    let solarPanels: SolarPanel[] = gridItems[config.GRID_ITEM_NAMES.SOLAR_PANEL];
    
    // Assuming the small batteries are not fully charged
    smallBatteries = smallBatteries.filter((battery) => !battery.isFull());

    // Filter the large batteries and remove the ones which do not have power in them
    largeBatteries = largeBatteries.filter((battery) => !battery.isEmpty());

    // Filter the solar panels and remove the ones with the minimum energy or empty
    const solarPanelsFiltered = await this.filterSolarPanelsByEnergyAmount(
      solarPanels
    );

    // Create an array of the possible energy givers
    const allEnergyProviders = [...solarPanelsFiltered, ...largeBatteries];

    return await this.determineSupplyingPath(
      smallBatteries,
      allEnergyProviders,
      shortestDistances
    );
  }

  /**
   * This method is used for charging the individual buildings which might not have energy energy
   * It calls the @method determineSupplyingPath which calculates which supplier can give these buildings power
   * @returns @interface ResultingSupplyingPath which holds a key value pair of @interface supplyingPath requesting mapping to
   * the one which can supplying, powerInput, and powerOutput
   */
  private async chargeBuildings(
    shortestDistances: {[source: string]: { [node: string]: Path}}
  ): Promise<ResultingSupplyingPath> {
    const gridItems = this.getGridItems();
    let buildings: Building[] = gridItems[config.GRID_ITEM_NAMES.ENERGY_USER];
    let smallBatteries: BioBattery[] = gridItems[config.GRID_ITEM_NAMES.SMALL_BATTERY];
    let largeBatteries: BioBattery[] = gridItems[config.GRID_ITEM_NAMES.LARGE_BATTERY];
    let solarPanels: SolarPanel[] = gridItems[config.GRID_ITEM_NAMES.SOLAR_PANEL];

    // Assuming that the houses asking for power will not have power in them.
    // Do not consider building with full power capacity
    buildings = buildings.filter((building) => {
      return building.getEnergyInJoules() === building.getMinCapacity();
    });

    // Filter the batteries and removes the ones which do not have power in them
    // Do not include batteries which are empty
    smallBatteries = smallBatteries.filter((battery) => !battery.isEmpty());
    largeBatteries = largeBatteries.filter((battery) => !battery.isEmpty());

    // Filter the solar panels and remove the ones with the minimum energy or empty
    const solarPanelsFiltered = await this.filterSolarPanelsByEnergyAmount(solarPanels)

    // Create an array of the possible energy givers
    const allEnergyProviders = [
      ...smallBatteries,
      ...solarPanelsFiltered,
      ...largeBatteries,
    ];

    return await this.determineSupplyingPath(
      buildings,
      allEnergyProviders,
      shortestDistances
    );
  }

  /**
   * This method determines which grid item can supply energy to the grid item without it.
   * It determines this by considering the needs of the grid item requesting the enrgy and
   * minimizing the distance between the supplying grid items and the receiver. It returns a key pair of receiver to supplier
   * @param recievingAgents holds a list of grid items (buildings or batteries but not both) which are requesting for energy
   * @param supplyingAgents holds a list of grid items (@class BioBattery or @class SolarPanel)
   * which can supply energy to @param recievingAgents
   * @param shortestDistances holds an object of key, value pair of vertex -> adj vertices with their shortest distance to the key vertex
   * @returns @interface ResultingSupplyingPath which holds a key value pair of @interface supplyingPath requesting mapping to
   * the one which can supplying, powerInput, and powerOutput
   */
  private async determineSupplyingPath(
    recievingAgents: config.RecievingAgents,
    supplyingAgents: config.SupplyingAgents[],
    shortestDistances: config.ShortestDistances
  ):  Promise<ResultingSupplyingPath> {
    // Create an object of buildings with the energyProviders which supplied
    let supplyToSupplyFromAgents: SupplyingPath = {};
    let totalPowerInput = 0;
    let totalPowerOutput = 0;
    // Look at each gridItem requesting for energy individually and keep track of the which grid item
    //  supplied it energy so that it can not be requested energy when it doesn't have it
    for (const recievingAgent of recievingAgents) {
      // get the energy which is being requested.
      // TODO: advancement For now implement all or nothing. If battery doesn't have all the energy required, ignore it
      // @see https://github.com/googleinterns/step141-2020/issues/54
      const energyReq = recievingAgent.getMaxCapacity() - recievingAgent.getEnergyInJoules();
      let powerSupplied = 0;
      // Get the voltage to be received
      const voltageReq = config.calculateVoltageFromPower(energyReq, recievingAgent.gridItemResistance);
      // Set the shortest distance between the two values supplier and receiver to be +infinity
      let shortestDistance = Number.POSITIVE_INFINITY;
      // Keep track of the batteryPosition
      let indexOfProvider = -1;
      // Check which supplier can offer the receiver energy, by the minimzing it's distances between
      // This has to change when you consider different sources giving the receiver energy
      for (let index = 0; index < supplyingAgents.length; index++) {
        // check the distance between the receiver and supplier. If it is the minimal, change the supplier index
        const newShortestDistance =
          shortestDistances[supplyingAgents[index].gridItemName][recievingAgent.gridItemName]
            .distance;
        
        if (
          newShortestDistance < shortestDistance
        ) {
          // Calculate the resistance in the wires whose length is the shortest distance
          const resistanceInWires = config.calculateResistance(newShortestDistance);
          // calculate the resistance in all gridItems which are in the shortest path
          const resistanceInGridItems = this.determineResistanceInShortestPath(
            supplyingAgents[index].gridItemName,
            recievingAgent.gridItemName,
            shortestDistances
          );
          // The total resistance in the shortest path including the one for the gridItems in the shortest path
          const totalResistance = resistanceInGridItems + resistanceInWires;
          // Calculate the circuit current. The circuit here is in series which implies that the current is constant
          const currentInCircuit = config.calculateCurrent(voltageReq, resistanceInGridItems, resistanceInWires);
          // Using the current, calculate the power in the entire circuit
          const energyProvided = config.calculatePowerWithCurrent(currentInCircuit, totalResistance);
          // Get the total energy which can be supplied by the supplying agent
          const energyInSupplier = supplyingAgents[index].getEnergyInJoules();
          if (energyInSupplier >= energyProvided) {
            shortestDistance = newShortestDistance;
            indexOfProvider = index;
            powerSupplied = energyProvided;
          }
        }
      }
      // In case there is no supplier for that receiver, ignore the reciever
      // TODO advancement, tell the grid about these cases of receiver asking for more than it can be given
      // @see https://github.com/googleinterns/step141-2020/issues/54
      if (indexOfProvider === -1) {
        continue;
      }
      // Update the power output and power input
      totalPowerOutput += energyReq;
      totalPowerInput += powerSupplied;
      // Update the supplier so that it cannot be asked for power again when it shouldn't be asked
      const provideFrom = supplyingAgents[indexOfProvider];
      const provideTo = recievingAgent;
      if (provideTo instanceof BioBattery) {
        provideTo.startCharging(energyReq);
      } else {
        provideTo.increaseEnergy(energyReq);
      }
      provideFrom.supplyPower(powerSupplied);

      this.clonedGraph.setNode(provideFrom.gridItemName, provideFrom);
      this.clonedGraph.setNode(provideTo.gridItemName, provideTo);

      // Remove the power from the supplier
      supplyingAgents[indexOfProvider].supplyPower(energyReq);
      // Add the pair of receiver : supplier in supplyToSupplyFromAgents
      supplyToSupplyFromAgents[recievingAgent.gridItemName] 
        = supplyingAgents[indexOfProvider].gridItemName;
    }
    
    return await {
      supplyingPath: supplyToSupplyFromAgents,
      inputPower: totalPowerInput,
      outputPower: totalPowerOutput,
    };
  }

  /**
   * This method determmines which grid item is in the shortest path.
   * @param start is the starting gridItem name in the shortestPath
   * @param dest is gridItem name for the destination in the shortestPath
   * @param shortestDistances holds an object of key, value pair of vertex -> adj vertices with their shortest distance to the key vertex
   * @returns a list of the names for the gridItems in the shortestPath
   */
  private determineGridItemsInShortestPath(
    start: string,
    dest: string,
    shortestDistances: config.ShortestDistances
  ): string[] {
    // Keeps track of the gridItems through which the power is going to pass
    let gridItemsInShortestPath = [dest];
    // Keeps track of the parent / predecessor of a vertex in the shortest distance path
    let parent = shortestDistances[start][dest].predecessor;
    while (parent !== start) {
      gridItemsInShortestPath.push(parent);
      parent = shortestDistances[start][parent].predecessor;
    }
    gridItemsInShortestPath.push(start);
    return gridItemsInShortestPath;
  }

/**
 * This method determines the resistance of the gridItems in the shortest path.
 * @param start is the starting gridItem name in the shortestPath
 * @param dest is gridItem name for the destination in the shortestPath
 * @param shortestDistances holds an object of key, value pair of vertex -> adj vertices with their shortest distance to the key vertex
 * @returns the total resistance of the gridItems in the shortest path excluding the wires (shortest distance itself)
 */
  private determineResistanceInShortestPath(
    start: string,
    dest: string,
    shortestDistances: config.ShortestDistances
  ) {
    const gridItemsInShortestPath 
      = this.determineGridItemsInShortestPath(start, dest, shortestDistances);
    let gridItemResistance = 0;
    for (const gridItemName of gridItemsInShortestPath) {
      const gridItem: GridItem = this.clonedGraph.node(gridItemName);
      gridItemResistance += gridItem.gridItemResistance;
    }
    return gridItemResistance;
  }

  private async filterSolarPanelsByEnergyAmount(solarPanels: SolarPanel[]): Promise< SolarPanel[]> {
    const solarPanelsFiltered = [];
    for (let i = 0; i < solarPanels.length; i++) {
      const solarPanel = solarPanels[i];
      if (!(await solarPanel.isEmpty())) {
        solarPanelsFiltered.push(solarPanel);
      }
    }
    return solarPanelsFiltered
  }
}
