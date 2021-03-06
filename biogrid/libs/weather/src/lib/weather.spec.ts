import { WeatherLib } from './weather';

let weatherLib: WeatherLib;
const addHours = (h: number, d: Date): Date => {
  d.setHours(d.getHours() + h);
  return d;
};
describe('weather', () => {
  beforeAll(async () => {
    const startDate = new Date();
    weatherLib = new WeatherLib(startDate, /* long = */ 0, /* lat = */ 0);
    await weatherLib.setup();
  });
  test('get the intensity for each hour of July 20th 2020 at long and lat 0 0', async () => {
    const cloudCoverage = weatherLib.getCloudCoverage(addHours(2, new Date()));
    expect(cloudCoverage >= 0 && 1 >= cloudCoverage).toBeTruthy();
  }, 30000);

  test('getIntensity throws an error for an out of range date', async () => {
    const startDate = new Date();
    const weatherLib = new WeatherLib(startDate, /* long = */ 0, /* lat = */ 0);
    await weatherLib.setup();
    expect(() =>
      weatherLib.getCloudCoverage(addHours(2, new Date('7/01/2020')))
    ).toThrowError(
      'Date 2020-07-01:2 not found within the specified time range'
    );
  });
  test('isDay for each hour of Today at long and lat 0 0 at hour 2', async () => {
    const startDate = new Date();
    const weatherLib = new WeatherLib(startDate, /* long = */ 0, /* lat = */ 0);
    await weatherLib.setup();
    const twoAM = new Date();
    twoAM.setHours(2);
    expect(weatherLib.isDay(twoAM)).toEqual(false);
  }, 30000);
  test('isDay throws an error for an out of range date', async () => {
    const startDate = new Date();
    const weatherLib = new WeatherLib(startDate, /* long = */ 0, /* lat = */ 0);
    await weatherLib.setup();
    expect(() =>
      weatherLib.isDay(addHours(2, new Date('7/01/2020')))
    ).toThrowError(
      'Date 2020-07-01:2 not found within the specified time range'
    );
  });
});
