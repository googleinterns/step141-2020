import {
  Biogrid,
  RuralArea,
  Building,
  BioBrain,
} from '@biogrid/biogrid-simulator';
export interface BiogridSimulationResults {
  energyWastedFromSource?: number;
  energyWastedInTransportation?: number;
  timeWithoutEnoughEnergy?: number;
  states: any[];
}

export interface NewBiogridOpts {
  startDate: Date;
  endDate: Date;
  smallBatteryCells: number;
  largeBatteryCells: number;
}

// TODO change to a stateless solution
// See issue: https://github.com/googleinterns/step141-2020/issues/50
let biogrid: Biogrid;
const biobrain = BioBrain.Instance;
const states: any[] = [];

// TODO, allow users to specify number of buildings, town size, and number of Solar Panels
// See issue: https://github.com/googleinterns/step141-2020/issues/49
export async function createNewBiogrid(body: NewBiogridOpts) {
  const buildings = [
    new Building(10, 2, 3),
    new Building(10, 5, 4),
    new Building(10, 4, 3),
    new Building(10, 1, 2),
    new Building(10, 3, 1),
  ];
  const town = new RuralArea(buildings, 10, 10);
  biogrid = new Biogrid(town, {
    numberOfLargeBatteryCells: body.largeBatteryCells,
    numberOfSmallBatteryCells: body.smallBatteryCells,
    numberOfSolarPanels: 10,
  });
  return 'Created';
}

export async function runBiogridSimulation() {
  const action = biobrain.computeAction(biogrid.getSystemState());
  biogrid.takeAction(action);
  states.push(biogrid.getJsonGraphDetails());
  return 'Fake';
}

export async function getSimulationResults(): Promise<
  BiogridSimulationResults
> {
  // TODO implement
  return {
    energyWastedFromSource: 10,
    energyWastedInTransportation: 12,
    timeWithoutEnoughEnergy: 24,
    states,
  };
}
