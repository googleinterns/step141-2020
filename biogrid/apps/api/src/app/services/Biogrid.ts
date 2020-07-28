import {
  Biogrid,
  RuralArea,
  Building,
  BioBrain,
} from '@biogrid/biogrid-simulator';
import { ItemPosition, TownSize } from '@biogrid/grid-simulator';
import constants from '../config/constants';
export interface BiogridSimulationResults {
  energyWastedFromSource?: number;
  energyWastedInTransportation?: number;
  timeWithoutEnoughEnergy?: number;
  townSize: {
    width: number;
    height: number;
  };
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

// TODO, allow users to specify where the buildings are on the grid rather than randomly scatter
// The issue can be found on https://github.com/googleinterns/step141-2020/issues/59
export async function simulateNewBiogrid(
  body: NewBiogridOpts
): Promise<BiogridSimulationResults> {
  const buildings: Building[] = [];
  for (let i = 0; i < body.numBuildings; i++) {
    const randomPos = createRandomBuildingPosition(
      body.townWidth,
      body.townHeight
    );
    buildings.push(new Building(10, randomPos.x, randomPos.y));
  }
  const town = new RuralArea(buildings, body.townWidth, body.townHeight);
  const biogrid = new Biogrid(town, {
    numberOfLargeBatteryCells: body.largeBatteryCells,
    numberOfSmallBatteryCells: body.smallBatteryCells,
    numberOfSolarPanels: body.numSolarPanels,
  });
  const biobrain = BioBrain.Instance;
  const initState = biogrid.getSystemState();
  const statesJson = [biogrid.getJsonGraphDetails()];
  for (let i = 0; i < constants.simulation.NUMBER_OF_SIM_CYCLES; i++) {
    const action = await biobrain.computeAction(initState);
    biogrid.takeAction(action);
    statesJson.push(biogrid.getJsonGraphDetails());
  }

  return {
    energyWastedFromSource: 10,
    energyWastedInTransportation: 12,
    timeWithoutEnoughEnergy: 24,
    states: statesJson,
    townSize: biogrid.getTownSize(),
  };
}
