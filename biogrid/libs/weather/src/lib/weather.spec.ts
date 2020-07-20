import { getSunlight } from './weather';

describe('weather', () => {
  test('get the intensity for July 7th 2013 at long and lat 0 0', () => {
    expect(getSunlight(new Date('7/7/2013'), 0, 0)).toEqual(10);
  });
});
