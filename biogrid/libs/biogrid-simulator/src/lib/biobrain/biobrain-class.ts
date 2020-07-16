import { Brain, GridAction, GridItem, StateGraph, SupplyingPath } from '@biogrid/grid-simulator';
import { BiogridAction, Building, BioBattery, BioEnergySource } from '@biogrid/biogrid-simulator';
import { GRID_ITEM_NAMES, SupplyToAgent, SupplyFromAgent, ShortestDistances } from '../config';
import { Path } from 'graphlib';


// We can only have one BioBrain per grid
export class BioBrain implements Brain {
  private static instance: BioBrain;
  private constructor() {}

  static get Instance(): BioBrain {
    if (!this.instance) {
      this.instance = new BioBrain();
    }
    return this.instance;
  }
  
  computeAction(state: StateGraph): GridAction {
    // TODO add the type of states
    let buildings: Building[] = [];
    let smallBatteries: BioBattery[] = [];
    let largeBatteries: BioBattery[] = [];
    let solarPanels: BioEnergySource[] = [];

    let shortestDistances = state.getShortestDistances();

    const allGridItems = state.getAllVertices();
    allGridItems.map(item => {
      const gridItem = state.getGridItem(item);
      if (gridItem.name.includes(GRID_ITEM_NAMES.ENERGY_USER)) {
        buildings.push(gridItem as Building);
      } else if (gridItem.name.includes(GRID_ITEM_NAMES.SMALL_BATTERY)) {
        smallBatteries.push(gridItem as BioBattery);
      } else if (gridItem.name.includes(GRID_ITEM_NAMES.LARGE_BATTERY)) {
        largeBatteries.push(gridItem as BioBattery);
      } else if (gridItem.name.includes(GRID_ITEM_NAMES.SOLAR_PANEL)) {
        solarPanels.push(gridItem as BioEnergySource);
      } else if (gridItem.name.includes(GRID_ITEM_NAMES.GRID)) {
        var grid: GridItem = gridItem;
      }
    });

    // Filter the solar panels and remove the ones with the minimum energy or empty
    solarPanels = solarPanels.filter((solarPanel) => !solarPanel.isEmpty());

    // Create an object of buildings with the energyProviders which supplied
    // TODO assign the building as Building not the names
    let buildingSuppliers: SupplyingPath = this.buildingCharging(
      buildings,
      smallBatteries,
      largeBatteries,
      solarPanels,
      shortestDistances
    );
    
    let smallBatterySupplier: SupplyingPath = this.chargeSmallBatteries(
      smallBatteries,
      largeBatteries,
      solarPanels,
      shortestDistances
    );
    
    let largeBatterySupplier: SupplyingPath = this.chargeLargebatteries(
      largeBatteries,
      solarPanels,
      shortestDistances
    );
    

    return new BiogridAction({
      ...buildingSuppliers,
      ...smallBatterySupplier,
      ...largeBatterySupplier
    });
  }

  private chargeLargebatteries(
    largeBatteries: BioBattery[],
    solarPanels: BioEnergySource[],
    shortestDistances: {[source: string]: { [node: string]: Path}}
  ): SupplyingPath {
    // Assuming the large battery is not fully charged
    largeBatteries = largeBatteries.filter((battery) => !battery.isFull());

    // Create an array of the possible energy givers
    const allEnergyProviders = [...solarPanels];
    
    return this.determineSupplyingPath(largeBatteries, allEnergyProviders, shortestDistances);
  }



  private chargeSmallBatteries(
    smallBatteries: BioBattery[],
    largeBatteries: BioBattery[],
    solarPanels: BioEnergySource[],
    shortestDistances: {[source: string]: { [node: string]: Path}}
  ): SupplyingPath {
    // Assuming the small batteries are not fully charged
    smallBatteries = smallBatteries.filter((battery) => !battery.isFull());
    
    // Filter the large batteries and remove the ones which do not have power in them
    largeBatteries = largeBatteries.filter((battery) => !battery.isEmpty());

    // Create an array of the possible energy givers
    const allEnergyProviders = [
      ...solarPanels,
      ...largeBatteries,
    ];

    return this.determineSupplyingPath(smallBatteries, allEnergyProviders, shortestDistances);
  }

  private buildingCharging(
    buildings: Building[],
    smallBatteries: BioBattery[],
    largeBatteries: BioBattery[],
    solarPanels: BioEnergySource[],
    shortestDistances: {[source: string]: { [node: string]: Path}}
  ): SupplyingPath {
    // Assuming that the houses asking for power will not have power in them.
    // Do not consider building with full power capacity
    buildings = buildings.filter((building) => {
      return building.getEnergyInJoules() === building.MinCapacity;
    });

    // Filter the batteries and removes the ones which do not have power in them
    // Do not include batteries which are empty
    smallBatteries = smallBatteries.filter((battery) => !battery.isEmpty());
    largeBatteries = largeBatteries.filter((battery) => !battery.isEmpty());

    // Create an array of the possible energy givers
    const allEnergyProviders = [
      ...smallBatteries,
      ...solarPanels,
      ...largeBatteries,
    ];

    return this.determineSupplyingPath(buildings, allEnergyProviders, shortestDistances);
  }

  private determineSupplyingPath(
    supplyToAgents: SupplyToAgent,
    supplyFromAgents: SupplyFromAgent[],
    shortestDistances: ShortestDistances
  ): SupplyingPath {
    // Create an object of buildings with the energyProviders which supplied
    // TODO: advancement: assign the supplyToAgent itself not the names
    let supplyToSupplyFromAgents: SupplyingPath = {};
    for (const supplyToAgent of supplyToAgents) {
      const energyReq = supplyToAgent.MaxCapacity - supplyToAgent.getEnergyInJoules();
      let shortestDistance = Number.POSITIVE_INFINITY;
      // Keep track of the batteryPosition
      let indexOfProvider = -1;
      for (let index = 0; index < supplyFromAgents.length; index++) {
        const newShortestDistance =
          shortestDistances[supplyToAgent.name][supplyFromAgents[index].name]
            .distance;
        const energyProvided = supplyFromAgents[index].getEnergyInJoules();
        if (
          newShortestDistance < shortestDistance &&
          energyProvided >= energyReq
        ) {
          shortestDistance = newShortestDistance;
          indexOfProvider = index;
        }
      }
      supplyFromAgents[indexOfProvider].supplyPower(energyReq);
      supplyToSupplyFromAgents[supplyToAgent.name] =
        supplyFromAgents[indexOfProvider].name;
    }
    return supplyToSupplyFromAgents;
  }
}
