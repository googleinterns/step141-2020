import {
  Brain,
  GridAction,
  StateGraph,
  SupplyingPath,
} from '@biogrid/grid-simulator';
import {
  BiogridAction,
  Building,
  BioBattery,
} from '@biogrid/biogrid-simulator';
import {
  GRID_ITEM_NAMES,
  RecievingAgents,
  SupplyingAgents,
  ShortestDistances,
} from '../config';
import { Path, Graph } from 'graphlib';
import { SolarPanel } from '../bioenergy-source';

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
    // Get the shortest distances between each gridItem to the rest of the gridItems
    let shortestDistances = state.getShortestDistances();

    // Create a clone of the graph becfore using it
    this.clonedGraph = state.cloneStateGraph();

    // Get all the gridItems, this changes in the graph once the buildings are
    // supplied energy, or the small batteries or large batteries
    let gridItems = this.getGridItems();

    // Create an object of buildings with the energyProviders which supplied
    let buildingSuppliers: SupplyingPath = await this.chargeBuildings(
      gridItems[GRID_ITEM_NAMES.ENERGY_USER],
      gridItems[GRID_ITEM_NAMES.SMALL_BATTERY],
      gridItems[GRID_ITEM_NAMES.LARGE_BATTERY],
      gridItems[GRID_ITEM_NAMES.SOLAR_PANEL],
      shortestDistances
    );
    // Update gridItems since they change in the graph after updating the buildings which required power
    gridItems = this.getGridItems();
    // Create an object of smallBatteries with the energyProviders which supplied
    let smallBatterySupplier: SupplyingPath = await this.chargeSmallBatteries(
      gridItems[GRID_ITEM_NAMES.SMALL_BATTERY],
      gridItems[GRID_ITEM_NAMES.LARGE_BATTERY],
      gridItems[GRID_ITEM_NAMES.SOLAR_PANEL],
      shortestDistances
    );
    // Update gridItems since they change in the graph after charging the non-charged batteries
    gridItems = this.getGridItems();
    // Create an object of largeBatteries with the energyProviders which supplied
    let largeBatterySupplier: SupplyingPath = await this.chargeLargebatteries(
      gridItems[GRID_ITEM_NAMES.LARGE_BATTERY],
      gridItems[GRID_ITEM_NAMES.SOLAR_PANEL],
      shortestDistances
    );

    return new BiogridAction({
      ...buildingSuppliers,
      ...smallBatterySupplier,
      ...largeBatterySupplier,
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
  private getGridItems() {
    let buildings: Building[] = [];
    let smallBatteries: BioBattery[] = [];
    let largeBatteries: BioBattery[] = [];
    let solarPanels: SolarPanel[] = [];

    const allGridItems = this.clonedGraph.nodes();
    // TODO: Implement with instanceof
    // @see https://github.com/googleinterns/step141-2020/issues/54
    allGridItems.map((item) => {
      const gridItem = this.clonedGraph.node(item);
      if (gridItem.name.includes(GRID_ITEM_NAMES.ENERGY_USER)) {
        buildings.push(gridItem as Building);
      } else if (gridItem.name.includes(GRID_ITEM_NAMES.SMALL_BATTERY)) {
        smallBatteries.push(gridItem as BioBattery);
      } else if (gridItem.name.includes(GRID_ITEM_NAMES.LARGE_BATTERY)) {
        largeBatteries.push(gridItem as BioBattery);
      } else if (gridItem.name.includes(GRID_ITEM_NAMES.SOLAR_PANEL)) {
        solarPanels.push(gridItem as SolarPanel);
      }
    });

    return {
      [GRID_ITEM_NAMES.ENERGY_USER]: buildings,
      [GRID_ITEM_NAMES.SMALL_BATTERY]: smallBatteries,
      [GRID_ITEM_NAMES.LARGE_BATTERY]: largeBatteries,
      [GRID_ITEM_NAMES.SOLAR_PANEL]: solarPanels,
    };
  }

  /**
   * This method is used for charging individual @param largeBatteries which might not have enough energy
   * @param largeBatteries hold the large baterries which are going to be charged in case they are not full
   * @param solarPanels holds the solar panels which are going to be used to charge @param largeBatteries
   * @param shortestDistances holds the shortest distances between one grid item to another
   * @return calls the @method determineSupplyingPath which returns @interface SupplyingPath
   */
  private async chargeLargebatteries(
    largeBatteries: BioBattery[],
    solarPanels: SolarPanel[],
    shortestDistances: { [source: string]: { [node: string]: Path } }
  ): Promise<SupplyingPath> {
    // Assuming the large battery is not fully charged
    largeBatteries = largeBatteries.filter((battery) => !battery.isFull());

    // Filter the solar panels and remove the ones with the minimum energy or empty
    const solarPanelsFiltered = await this.filterSolarPanelsByEnergyAmount(solarPanels)

    // Create an array of the possible energy givers
    const allEnergyProviders = [...solarPanelsFiltered];

    return await this.determineSupplyingPath(
      largeBatteries,
      allEnergyProviders,
      shortestDistances
    );
  }

  /**
   * This method is used for charging individual @param smallBatteries which might not have energy energy
   * @param smallBatteries holds the small batteries which are going to be charged in case they are not full
   * @param largeBatteries holds the large batteries which can be used to charge @param smallBatteries
   * @param solarPanels holds the solar panels which can be used to charge @param smallBatteries
   * @param shortestDistances holds the shortest distances between one grid item to another
   * @return calls the @method determineSupplyingPath which returns @interface SupplyingPath
   */
  private async chargeSmallBatteries(
    smallBatteries: BioBattery[],
    largeBatteries: BioBattery[],
    solarPanels: SolarPanel[],
    shortestDistances: { [source: string]: { [node: string]: Path } }
  ): Promise<SupplyingPath> {
    // Assuming the small batteries are not fully charged
    smallBatteries = smallBatteries.filter((battery) => !battery.isFull());

    // Filter the large batteries and remove the ones which do not have power in them
    largeBatteries = largeBatteries.filter((battery) => !battery.isEmpty());

    // Filter the solar panels and remove the ones with the minimum energy or empty

    // Create an array of the possible energy givers
    const allEnergyProviders = [...solarPanels, ...largeBatteries];

    return await this.determineSupplyingPath(
      smallBatteries,
      allEnergyProviders,
      shortestDistances
    );
  }

  /**
   * This method is used for charging the individual @param buildings which might not have energy energy
   * @param buildings holds the buildings which you are supplying energy to
   * @param smallBatteries holds the small baterries which can supply energy to @param buildings
   * @param largeBatteries holds the large batteries which can supply energy to @param buildings
   * @param solarPanels holds the solar panels which can supply energy to @param buildings
   * @param shortestDistances holds the shortests distances from one gridItem to another
   * @return calls the @method determineSupplyingPath which returns @interface SupplyingPath
   */
  private async chargeBuildings(
    buildings: Building[],
    smallBatteries: BioBattery[],
    largeBatteries: BioBattery[],
    solarPanels: SolarPanel[],
    shortestDistances: { [source: string]: { [node: string]: Path } }
  ): Promise<SupplyingPath> {
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
      ...solarPanels,
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
   * @returns @interface SupplyingPath which holds a key value pair of a gridItem requesting mapping to the one which can supplying
   */
  private async determineSupplyingPath(
    recievingAgents: RecievingAgents,
    supplyingAgents: SupplyingAgents[],
    shortestDistances: ShortestDistances
  ): Promise<SupplyingPath> {
    // Create an object of buildings with the energyProviders which supplied
    let supplyToSupplyFromAgents: SupplyingPath = {};
    // Look at each gridItem requesting for energy individually and keep track of the which grid item
    //  supplied it energy so that it can not be requested energy when it doesn't have it
    for (const recievingAgent of recievingAgents) {
      // get the energy which is being requested.
      // TODO: advancement For now implement all or nothing. If battery doesn't have all the energy required, ignore it
      // @see https://github.com/googleinterns/step141-2020/issues/54
      const energyReq =
        recievingAgent.getMaxCapacity() - recievingAgent.getEnergyInJoules();
      // set the shortest distance between the two values supplier and receiver to be +infinity
      let shortestDistance = Number.POSITIVE_INFINITY;
      // Keep track of the batteryPosition
      let indexOfProvider = -1;
      // Check which supplier can offer the receiver energy, by the minimzing it's distances between
      // This has to change when you consider different sources giving the receiver energy
      for (let index = 0; index < supplyingAgents.length; index++) {
        // check the distance between the receiver and supplier. If it is the minimal, change the supplier index
        const newShortestDistance =
          shortestDistances[supplyingAgents[index].name][recievingAgent.name]
            .distance;
        const energyProvided = await supplyingAgents[index].getEnergyInJoules();
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

      this.clonedGraph.setNode(provideFrom.name, provideFrom);
      this.clonedGraph.setNode(provideTo.name, provideTo);

      // add the pair of receiver : supplier in supplyToSupplyFromAgents
      supplyingAgents[indexOfProvider].supplyPower(energyReq);
      supplyToSupplyFromAgents[recievingAgent.name] =
        supplyingAgents[indexOfProvider].name;
    }
    return supplyToSupplyFromAgents;
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
