import { weather } from './weather';

describe('weather', () => {
  it('should work', () => {
    expect(weather()).toEqual('weather');
  });
});
