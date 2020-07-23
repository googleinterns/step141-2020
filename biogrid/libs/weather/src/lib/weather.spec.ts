import { WeatherLib } from './weather';

describe('weather', () => {
  test('get the intensity for each hour of July 20th 2020 at long and lat 0 0', async () => {
    const startDate = new Date('7/20/2020');
    const weatherLib = new WeatherLib(
      startDate,
      /* long = */ 0,
      /* lat = */ 0
    );
    await weatherLib.setup()
    expect(weatherLib.getSunlight()).toEqual(10);
  }, 30000);
});
