import {
  Biogrid,
  RuralArea,
  Building,
  BioBrain,
} from '@biogrid/biogrid-simulator';
import { ItemPosition } from '@biogrid/grid-simulator';
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
  numBuildings: number;
  numSolarPanels: number;
  townHeight: number;
  townWidth: number;
}

function createRandomBuildingPosition(
  townWidth: number,
  townHeight: number
): ItemPosition {
  const x = Math.floor(Math.random() * townWidth);
  const y = Math.floor(Math.random() * townHeight);
  return {
    x,
    y,
  };
}

// TODO, allow users to specify where the buildings are on the grid rather than  randomly scatter
export async function simulateNewBiogrid(
  body: NewBiogridOpts
): Promise<BiogridSimulationResults> {
  const buildings = new Array(body.numBuildings).map((v) => {
    const randomPos = createRandomBuildingPosition(
      body.townWidth,
      body.townHeight
    );
    return new Building(10, randomPos.x, randomPos.y);
  });
  const town = new RuralArea(buildings, body.townWidth, body.townHeight);
  const biogrid = new Biogrid(town, {
    numberOfLargeBatteryCells: body.largeBatteryCells,
    numberOfSmallBatteryCells: body.smallBatteryCells,
    numberOfSolarPanels: body.numSolarPanels,
  });
  const biobrain = BioBrain.Instance;
  const initState = biogrid.getSystemState()
  const statesJson = [biogrid.getJsonGraphDetails()];
  const action = biobrain.computeAction(initState);
  biogrid.takeAction(action);
  statesJson.push(biogrid.getJsonGraphDetails());
  return {
    energyWastedFromSource: 10,
    energyWastedInTransportation: 12,
    timeWithoutEnoughEnergy: 24,
    states: statesJson,
  };
}
