import { Biogrid, RuralArea, Building, BioBrain } from '@biogrid/biogrid-simulator'
import { Graph } from 'graphlib'
export interface BiogridSimulationResults {
  energyWastedFromSource?: number;
  energyWastedInTransportation?: number;
  timeWithoutEnoughEnergy?: number;
  states: Graph[];
}

export interface NewBiogridOpts {
  startDate: Date;
  endDate: Date;
  smallBatteryCells: number;
  largeBatteryCells: number;
}

// TODO change to a stateless solution
let biogrid: Biogrid
const biobrain = BioBrain.Instance
const states: Graph[] = []

export async function createNewBiogrid(body: NewBiogridOpts) {
  // TODO allow user to specify number of building
  const buildings = [
    new Building(10, 2, 3),
    new Building(10, 5, 4),
    new Building(10, 4, 3),
    new Building(10, 1, 2),
    new Building(10, 3, 1),
  ]
  // TODO allow user to specify town size
  const town = new RuralArea(buildings, 10, 10);
  biogrid  = new Biogrid(town, {
    numberOfLargeBatteryCells: body.largeBatteryCells,
    numberOfSmallBatteryCells: body.smallBatteryCells,
    // TODO allow user to specify
    numberOfSolarPanels: 10
  })
  return "Created"
}

export async function runBiogridSimulation() {
  const action = biobrain.computeAction(biogrid.getSystemState())
  states.push(biogrid.takeAction(action).getGraph());
  return "Fake"
}

export async function getSimulationResults(): Promise<BiogridSimulationResults> {
  // TODO implement
  return {
    energyWastedFromSource: 10,
    energyWastedInTransportation: 12,
    timeWithoutEnoughEnergy: 24,
    states
  }
}
