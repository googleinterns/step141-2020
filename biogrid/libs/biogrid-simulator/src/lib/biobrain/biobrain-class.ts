import {
  Brain,
  GridAction,
  StateGraph,
  SupplyingPath,
  GridItem,
  Power,
  Resistance
} from '@biogrid/grid-simulator';
import {
  BiogridAction,
  Building,
  BioBattery
} from '@biogrid/biogrid-simulator';
import {
  GRID_ITEM_NAMES,
  RecievingAgents,
  SupplyingAgents,
  ShortestDistances,
  calculateResistance,
  calculatePowerWithCurrent,
  calculateCurrent,
  calculateVoltageFromPower,
  calculateEfficiency
} from '../config';
import { Path, Graph } from 'graphlib';
import { SolarPanel } from '../bioenergy-source';


interface gridItemsList {
  [GRID_ITEM_NAMES.ENERGY_USER]: Building[], 
  [GRID_ITEM_NAMES.SMALL_BATTERY]: BioBattery[], 
  [GRID_ITEM_NAMES.LARGE_BATTERY]: BioBattery[], 
  [GRID_ITEM_NAMES.SOLAR_PANEL]: SolarPanel[]
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

  computeAction(state: StateGraph): GridAction {
    // TODO calculate the efficiency for every transportation of power
    // Get the shortest distances between each gridItem to the rest of the gridItems
    let shortestDistances = state.getShortestDistances();

    // Create a clone of the graph becfore using it
    this.clonedGraph = state.cloneStateGraph();

    // Create an object of buildings with the energyProviders which supplied
    let buildingSuppliers: SupplyingPath = this.chargeBuildings(
      shortestDistances
    );
    
    // Create an object of smallBatteries with the energyProviders which supplied
    let smallBatterySupplier: SupplyingPath = this.chargeSmallBatteries(
      shortestDistances
    );
    // Create an object of largeBatteries with the energyProviders which supplied
    let largeBatterySupplier: SupplyingPath = this.chargeLargebatteries(
      shortestDistances
    );

    return new BiogridAction({
      ...buildingSuppliers,
      ...smallBatterySupplier,
      ...largeBatterySupplier
    });
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
    allGridItems.map(item => {
      const gridItem = this.clonedGraph.node(item);
      if (gridItem.gridItemName.includes(GRID_ITEM_NAMES.ENERGY_USER)) {
        buildings.push(gridItem as Building);
      } else if (gridItem.gridItemName.includes(GRID_ITEM_NAMES.SMALL_BATTERY)) {
        smallBatteries.push(gridItem as BioBattery);
      } else if (gridItem.gridItemName.includes(GRID_ITEM_NAMES.LARGE_BATTERY)) {
        largeBatteries.push(gridItem as BioBattery);
      } else if (gridItem.gridItemName.includes(GRID_ITEM_NAMES.SOLAR_PANEL)) {
        solarPanels.push(gridItem as SolarPanel);
      }
    });

    return {
      [GRID_ITEM_NAMES.ENERGY_USER]: buildings,
      [GRID_ITEM_NAMES.SMALL_BATTERY]: smallBatteries,
      [GRID_ITEM_NAMES.LARGE_BATTERY]: largeBatteries,
      [GRID_ITEM_NAMES.SOLAR_PANEL]: solarPanels
    };
  }

  /**
   * This method is used for charging individual largeBatteries which might not have enough energy
   * It calls the @method determineSupplyingPath which calculates which supplier can give these large batteries power
   * @returns @interface SupplyingPath which holds a key value pair of a gridItem requesting mapping to the one which can supplying
   */
  private chargeLargebatteries(
    shortestDistances: {[source: string]: { [node: string]: Path}}
  ): SupplyingPath {
    const gridItems = this.getGridItems();
    let largeBatteries: BioBattery[] = gridItems[GRID_ITEM_NAMES.LARGE_BATTERY];
    let solarPanels: SolarPanel[] = gridItems[GRID_ITEM_NAMES.SOLAR_PANEL];
    // Assuming the large battery is not fully charged
    largeBatteries = largeBatteries.filter((battery) => !battery.isFull());

    // Filter the solar panels and remove the ones with the minimum energy or empty
    solarPanels = solarPanels.filter((solarPanel) => !solarPanel.isEmpty());

    // Create an array of the possible energy givers
    const allEnergyProviders = [...solarPanels];

    return this.determineSupplyingPath(largeBatteries, allEnergyProviders, shortestDistances);
  }

  /**
   * This method is used for charging individual smallBatteries which might not have energy energy
   * It calls the @method determineSupplyingPath which calculates which supplier can give these small batteries power
   * @returns @interface SupplyingPath which holds a key value pair of a gridItem requesting mapping to the one which can supplying
   */
  private chargeSmallBatteries(
    shortestDistances: {[source: string]: { [node: string]: Path}}
  ): SupplyingPath {
    const gridItems = this.getGridItems();
    let smallBatteries: BioBattery[] = gridItems[GRID_ITEM_NAMES.SMALL_BATTERY];
    let largeBatteries: BioBattery[] = gridItems[GRID_ITEM_NAMES.LARGE_BATTERY];
    let solarPanels: SolarPanel[] = gridItems[GRID_ITEM_NAMES.SOLAR_PANEL];
    
    // Assuming the small batteries are not fully charged
    smallBatteries = smallBatteries.filter((battery) => !battery.isFull());

    // Filter the large batteries and remove the ones which do not have power in them
    largeBatteries = largeBatteries.filter((battery) => !battery.isEmpty());

    // Filter the solar panels and remove the ones with the minimum energy or empty
    solarPanels = solarPanels.filter((solarPanel) => !solarPanel.isEmpty());

    // Create an array of the possible energy givers
    const allEnergyProviders = [
      ...solarPanels,
      ...largeBatteries,
    ];

    return this.determineSupplyingPath(smallBatteries, allEnergyProviders, shortestDistances);
  }

  /**
   * This method is used for charging the individual buildings which might not have energy energy
   * It calls the @method determineSupplyingPath which calculates which supplier can give these buildings power
   * @returns @interface SupplyingPath which holds a key value pair of a gridItem requesting mapping to the one which can supplying
   */
  private chargeBuildings(
    shortestDistances: {[source: string]: { [node: string]: Path}}
  ): SupplyingPath {
    const gridItems = this.getGridItems();
    let buildings: Building[] = gridItems[GRID_ITEM_NAMES.ENERGY_USER];
    let smallBatteries: BioBattery[] = gridItems[GRID_ITEM_NAMES.SMALL_BATTERY];
    let largeBatteries: BioBattery[] = gridItems[GRID_ITEM_NAMES.LARGE_BATTERY];
    let solarPanels: SolarPanel[] = gridItems[GRID_ITEM_NAMES.SOLAR_PANEL];

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
    solarPanels = solarPanels.filter((solarPanel) => !solarPanel.isEmpty());

    // Create an array of the possible energy givers
    const allEnergyProviders = [
      ...smallBatteries,
      ...solarPanels,
      ...largeBatteries,
    ];

    return this.determineSupplyingPath(buildings, allEnergyProviders, shortestDistances);
  }

  /**
   * This method determines which grid item can supply energy to the grid item without it.
   * It determines this by considering the needs of the grid item requesting the enrgy and
   * minimizing the distance between the supplying grid items and the receiver. It returns a key pair of receiver to supplier
   * @param recievingAgents holds a list of grid items (buildings or batteries but not both) which are requesting for energy
   * @param supplyingAgents holds a list of grid items (@class BioBattery or @class SolarPanel)
   * which can supply energy to @param recievingAgents
   * @param shortestDistances holds an object of key, value pair of vertex -> adj vertices with their shortest distance to the key vertex
   * @returns @interface SupplyingPath which holds a key value pair of a gridItem requesting mapping to the one which can supplying
   */
  private determineSupplyingPath(
    recievingAgents: RecievingAgents,
    supplyingAgents: SupplyingAgents[],
    shortestDistances: ShortestDistances
  ): SupplyingPath {
    // Create an object of buildings with the energyProviders which supplied
    let supplyToSupplyFromAgents: SupplyingPath = {};
    // Look at each gridItem requesting for energy individually and keep track of the which grid item
    //  supplied it energy so that it can not be requested energy when it doesn't have it
    for (const recievingAgent of recievingAgents) {
      // get the energy which is being requested.
      // TODO: advancement For now implement all or nothing. If battery doesn't have all the energy required, ignore it
      // @see https://github.com/googleinterns/step141-2020/issues/54
      const energyReq = recievingAgent.getMaxCapacity() - recievingAgent.getEnergyInJoules();
      // set the shortest distance between the two values supplier and receiver to be +infinity
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
        const energyProvided = supplyingAgents[index].getEnergyInJoules();
        if (
          newShortestDistance < shortestDistance &&
          energyProvided >= energyReq
        ) {
          shortestDistance = newShortestDistance;
          indexOfProvider = index;
        }
      }
      // In case there is no supplier for that receiver, ignore the reciever
      // TODO advancement, tell the grid about these cases of receiver asking for more than it can be given
      // @see https://github.com/googleinterns/step141-2020/issues/54
      if (indexOfProvider === -1) {
        continue;
      }
      // Update the supplier so that it cannot be asked for power again when it shouldn't be asked
      const provideFrom = supplyingAgents[indexOfProvider];
      const provideTo = recievingAgent;
      if (provideTo instanceof BioBattery) {
        provideTo.startCharging(energyReq);
      } else {
        provideTo.increaseEnergy(energyReq);
      }
      provideFrom.supplyPower(energyReq);

      this.clonedGraph.setNode(provideFrom.gridItemName, provideFrom);
      this.clonedGraph.setNode(provideTo.gridItemName, provideTo);

      // add the pair of receiver : supplier in supplyToSupplyFromAgents
      supplyingAgents[indexOfProvider].supplyPower(energyReq);
      supplyToSupplyFromAgents[recievingAgent.gridItemName] =
        supplyingAgents[indexOfProvider].gridItemName;
    }
    return supplyToSupplyFromAgents;
  }

  /**
   * This function is used to determine the resistance of the wires used for transporting power from one end to another
   * @param length is the distance travelled by the power from supplier to receiver
   */
  private determineResistanceInWires(length: number) {
    return calculateResistance(length);
  }

  private determineGridItemsInShortestPath(
    start: string,
    dest: string,
    shortestDistances: ShortestDistances
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

  private determineResistanceInShortestPath(
    start: string,
    dest: string,
    shortestDistances: ShortestDistances
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

  private calculateVoltageToBeReceived(power: Power, resistance: Resistance) {
    return calculateVoltageFromPower(power, resistance);
  }

  private calculateCurrentToBeInCircuit(voltage: number, loadResistance: number, wireResistance: number) {
    return calculateCurrent(voltage, loadResistance, wireResistance);
  }

  private calculatePowerToBeSupplied(current: number, resistance: number) {
    return calculatePowerWithCurrent(current, resistance);
  }

  private calculateSystemEfficiency(input: Power, output: Power) {
    return calculateEfficiency(input, output);
  }
}
