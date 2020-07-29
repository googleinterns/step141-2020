import { simulateNewBiogrid } from './Biogrid';
import { GRID_ITEM_NAMES } from '@biogrid/biogrid-simulator';

describe('weather', () => {
  test('simulateNewBiogrid placed the proper amount of items on the grid', async () => {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 2);
    endDate.setDate(endDate.getDate() - 1);
    const smallBatteryCells = 5,
      largeBatteryCells = 2,
      numBuildings = 5,
      numSolarPanels = 5,
      townHeight = 10,
      townWidth = 10;
    const results = await simulateNewBiogrid({
      startDate,
      endDate,
      smallBatteryCells,
      largeBatteryCells,
      numBuildings,
      numSolarPanels,
      townHeight,
      townWidth,
    });
    const allItems: string[] = (results.states[0] as any).nodes.map(
      (node: any) => node.v
    );
    const smallBatteryCellsCount = allItems.filter(
      (item) => item.includes(GRID_ITEM_NAMES.SMALL_BATTERY)
    ).length;
    const largeBatteryCellsCount = allItems.filter(
      (item) => item.includes(GRID_ITEM_NAMES.LARGE_BATTERY)
    ).length;
    const buildingsCount = allItems.filter(
      (item) => item.includes(GRID_ITEM_NAMES.ENERGY_USER)
    ).length;
    const solarPanelsCount = allItems.filter(
      (item) => item.includes(GRID_ITEM_NAMES.SOLAR_PANEL)
    ).length;
    expect(smallBatteryCellsCount).toEqual(smallBatteryCells);
    expect(largeBatteryCellsCount).toEqual(largeBatteryCells);
    expect(buildingsCount).toEqual(numBuildings);
    expect(solarPanelsCount).toEqual(numSolarPanels);
  });
});
