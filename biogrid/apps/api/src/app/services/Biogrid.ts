export interface BiogridSimulationResults {
  energyWastedFromSource: number;
  energyWastedInTransportation: number;
  timeWithoutEnoughEnergy: number;
}

export interface NewBiogridOpts {
  startDate: Date;
  endDate: Date;
  smallBatteryCells: number;
  largeBatteryCells: number;
}

export async function createNewBiogrid(body: NewBiogridOpts) {
  // TODO implement
  return "Fake"
}

export async function runBiogridSimulation() {
  // TODO implement
  return "Fake"
}

export async function getSimulationResults(): Promise<BiogridSimulationResults> {
  // TODO implement
  return {
    energyWastedFromSource: 10,
    energyWastedInTransportation: 12,
    timeWithoutEnoughEnergy: 24
  }
}
