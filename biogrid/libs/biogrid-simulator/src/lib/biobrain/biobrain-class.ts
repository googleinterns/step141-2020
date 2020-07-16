import { Brain, GridAction, GridItem, StateGraph } from '@biogrid/grid-simulator';
import { BiogridAction, Building, BioBattery, BioEnergySource, BiogridState } from '@biogrid/biogrid-simulator';
import { GRID_ITEM_NAMES } from '../config';

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

    // Assuming that the houses asking for power will not have power in them.
    // Do not consider building with full power capacity
    buildings = buildings.filter((building) => {
      return building.getEnergyInJoules() === building.MinCapacity;
    });

    // Filter the batteries and removes the ones which do not have power in them
    // Do not include batteries which are empty
    smallBatteries = smallBatteries.filter((battery) => !battery.isEmpty());
    largeBatteries = largeBatteries.filter((battery) => !battery.isEmpty());

    // Filter the solar panels so that we have the ones with more than minimum energy
    solarPanels = solarPanels.filter((solarPanel) => !solarPanel.isEmpty());

    // Create an object of buildings with the energyProviders which supplied
    // TODO assign the building itself not the
    let buildingSuppliers: { [string: string] : string} = {}

    // Create an array of the possible energy givers
    const allEnergyProviders = [
      ...smallBatteries,
      ...solarPanels,
      ...largeBatteries
    ];

    for (const building of buildings) {
      const energyReq = building.MaxCapcaity - building.getEnergyInJoules();
      let shortestDistance = Number.POSITIVE_INFINITY;
      // Keep track of the batteryPosition
      let indexOfProvider = -1;
      for (let index = 0; index < allEnergyProviders.length; index++) {
        const newShortestDistance = shortestDistances[building.name][allEnergyProviders[index].name].distance;
        const energyProvided = allEnergyProviders[index].getEnergyAmount();
        if (newShortestDistance < shortestDistance && energyProvided >= energyReq){
          shortestDistance = newShortestDistance;
          indexOfProvider = index;
        }
      }
      allEnergyProviders[indexOfProvider].supplyPower(energyReq);
      buildingSuppliers[building.name] = allEnergyProviders[indexOfProvider].name;
    }

    return new BiogridAction([]);
  }
}
