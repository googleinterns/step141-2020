import { Brain, GridAction, GridItem, StateGraph } from '@biogrid/grid-simulator';
import { BiogridAction, Building, BioBattery, BioEnergySource, BiogridState } from '@biogrid/biogrid-simulator';
import { GRID_ITEM_NAMES, ReturnedAction } from '../config';
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
    let grid: GridItem

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
    let buildingSuppliers: ReturnedAction = this.buildingCharging(
      buildings,
      smallBatteries,
      largeBatteries,
      solarPanels,
      shortestDistances
    );
    
    let smallBatterySupplier: ReturnedAction = this.chargeSmallBatteries(
      smallBatteries,
      largeBatteries,
      solarPanels,
      shortestDistances
    );
    
    let largeBatterySupplier: ReturnedAction = this.chargeLargebatteries(
      largeBatteries,
      solarPanels,
      shortestDistances
    );
    

    return new BiogridAction([]);
  }

  private chargeLargebatteries(
    largeBatteries: BioBattery[],
    solarPanels: BioEnergySource[],
    shortestDistances: {[source: string]: { [node: string]: Path}}
  ): ReturnedAction {
      // Assuming the large battery is not fully charged
      largeBatteries = largeBatteries.filter((battery) => !battery.isFull());

      // Create an object of buildings with the energyProviders which supplied
      // TODO assign the battery itself not the names
      let largeBatterySuppliers: ReturnedAction = {};

      // Create an array of the possible energy givers
      const allEnergyProviders = [...solarPanels];
      for (const largeBattery of largeBatteries) {
      const energyReq = largeBattery.getMaxcapacity() - largeBattery.getEnergyAmount();
      let shortestDistance = Number.POSITIVE_INFINITY;
      // Keep track of the batteryPosition
      let indexOfProvider = -1;
      for (let index = 0; index < allEnergyProviders.length; index++) {
        const newShortestDistance =
          shortestDistances[largeBattery.name][allEnergyProviders[index].name]
            .distance;
        const energyProvided = allEnergyProviders[index].getEnergyAmount();
        if (
          newShortestDistance < shortestDistance &&
          energyProvided >= energyReq
        ) {
          shortestDistance = newShortestDistance;
          indexOfProvider = index;
        }
      }
      allEnergyProviders[indexOfProvider].supplyPower(energyReq);
      largeBatterySuppliers[largeBattery.name] =
        allEnergyProviders[indexOfProvider].name;
    }
    return largeBatterySuppliers;
  }



  private chargeSmallBatteries(
    smallBatteries: BioBattery[],
    largeBatteries: BioBattery[],
    solarPanels: BioEnergySource[],
    shortestDistances: {[source: string]: { [node: string]: Path}}
  ): ReturnedAction {
    // Assuming the small batteries are not fully charged
    smallBatteries = smallBatteries.filter((battery) => !battery.isFull());
    
    // Filter the large batteries and remove the ones which do not have power in them
    largeBatteries = largeBatteries.filter((battery) => !battery.isEmpty());

    // Create an object of buildings with the energyProviders which supplied
    // TODO assign the battery itself not the names
    let smallBatterySuppliers: ReturnedAction = {};

    // Create an array of the possible energy givers
    const allEnergyProviders = [
      ...solarPanels,
      ...largeBatteries,
    ];

    for (const smallBattery of smallBatteries) {
      const energyReq = smallBattery.getMaxcapacity() - smallBattery.getEnergyAmount();
      let shortestDistance = Number.POSITIVE_INFINITY;
      // Keep track of the batteryPosition
      let indexOfProvider = -1;
      for (let index = 0; index < allEnergyProviders.length; index++) {
        const newShortestDistance =
          shortestDistances[smallBattery.name][allEnergyProviders[index].name]
            .distance;
        const energyProvided = allEnergyProviders[index].getEnergyAmount();
        if (
          newShortestDistance < shortestDistance &&
          energyProvided >= energyReq
        ) {
          shortestDistance = newShortestDistance;
          indexOfProvider = index;
        }
      }
      allEnergyProviders[indexOfProvider].supplyPower(energyReq);
      smallBatterySuppliers[smallBattery.name] =
        allEnergyProviders[indexOfProvider].name;
    }

    return smallBatterySuppliers;
  }

  private buildingCharging(
    buildings: Building[],
    smallBatteries: BioBattery[],
    largeBatteries: BioBattery[],
    solarPanels: BioEnergySource[],
    shortestDistances: {[source: string]: { [node: string]: Path}}
  ): ReturnedAction {
    // Assuming that the houses asking for power will not have power in them.
    // Do not consider building with full power capacity
    buildings = buildings.filter((building) => {
      return building.getEnergyInJoules() === building.MinCapacity;
    });

    // Filter the batteries and removes the ones which do not have power in them
    // Do not include batteries which are empty
    smallBatteries = smallBatteries.filter((battery) => !battery.isEmpty());
    largeBatteries = largeBatteries.filter((battery) => !battery.isEmpty());

    // Create an object of buildings with the energyProviders which supplied
    // TODO assign the building itself not the names
    let buildingSuppliers: ReturnedAction = {};

    // Create an array of the possible energy givers
    const allEnergyProviders = [
      ...smallBatteries,
      ...solarPanels,
      ...largeBatteries,
    ];

    for (const building of buildings) {
      const energyReq = building.MaxCapcaity - building.getEnergyInJoules();
      let shortestDistance = Number.POSITIVE_INFINITY;
      // Keep track of the batteryPosition
      let indexOfProvider = -1;
      for (let index = 0; index < allEnergyProviders.length; index++) {
        const newShortestDistance =
          shortestDistances[building.name][allEnergyProviders[index].name]
            .distance;
        const energyProvided = allEnergyProviders[index].getEnergyAmount();
        if (
          newShortestDistance < shortestDistance &&
          energyProvided >= energyReq
        ) {
          shortestDistance = newShortestDistance;
          indexOfProvider = index;
        }
      }
      allEnergyProviders[indexOfProvider].supplyPower(energyReq);
      buildingSuppliers[building.name] =
        allEnergyProviders[indexOfProvider].name;
    }
    return buildingSuppliers;
  }
}
