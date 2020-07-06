export interface BiogridSimulationResults {
  energyWastedFromSource: number;
  energyWastedInTransportation: number;
  timeWithoutEnoughEnergy: number;
}

export async function createNewBiogrid() {
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
